export type Kiosk={id:string;name:string;address:string;status:string}
export type Job={upload_id?:number;filename?:string;display_name?:string;kiosk_name?:string;kiosk?:string;created_at?:string;status?:string;job_status?:string;payment_status?:string;pickup_code?:string}
const base=String(import.meta.env.VITE_API_URL||'https://arox-api-993539509814.asia-south1.run.app').replace(/\/+$/,'')
const key='arox-web-session'
let memorySession:any=null
export const api={
 session():any{try{const saved=sessionStorage.getItem(key);if(saved)return JSON.parse(saved)}catch{}return memorySession},
 save(s:any){memorySession=s;try{sessionStorage.setItem(key,JSON.stringify(s))}catch{}},
 clear(){memorySession=null;try{sessionStorage.removeItem(key)}catch{}},
 whatsappPrint(phone='918015048274'){return this.call('/whatsapp/print/'+encodeURIComponent(phone))},
 async call<T=any>(path:string,options:RequestInit&{auth?:boolean}={}):Promise<T>{
 const headers=new Headers(options.headers);if(options.body&&!(options.body instanceof FormData))headers.set('Content-Type','application/json')
 if(options.auth!==false&&this.session()?.token)headers.set('Authorization','Bearer '+this.session().token)
 let response:Response;try{response=await fetch(base+path,{...options,headers})}catch{throw Error('Cannot reach AROX API. Check the network and CORS_ALLOWED_ORIGINS for this site.')}
 const text=await response.text();if(!text.trim()){if(!response.ok)throw Error('AROX returned HTTP '+response.status);throw Error(`AROX API returned an empty response from ${new URL(response.url).pathname} (HTTP ${response.status})`)}let data:any;try{data=JSON.parse(text)}catch{data={message:text}}
 if(!response.ok)throw Error(data.error||data.message||('AROX returned HTTP '+response.status));return data
 }}
export async function firebase(endpoint:string,body:any){
 const apiKey=import.meta.env.VITE_FIREBASE_API_KEY;if(!apiKey)throw Error('Set VITE_FIREBASE_API_KEY to enable Firebase sign-in.')
 const url=endpoint==='token'?'https://securetoken.googleapis.com/v1/token?key='+apiKey:'https://identitytoolkit.googleapis.com/v1/accounts:'+endpoint+'?key='+apiKey;const r=await fetch(url,{method:'POST',headers:{'Content-Type':endpoint==='token'?'application/x-www-form-urlencoded':'application/json'},body:endpoint==='token'?new URLSearchParams(body as Record<string,string>).toString():JSON.stringify(body)})
 const d:any=await r.json();if(!r.ok){const c=d.error?.message||'Firebase error';const map:any={EMAIL_NOT_FOUND:'No account for that email.',INVALID_PASSWORD:'Incorrect password.',INVALID_LOGIN_CREDENTIALS:'Check your email and password.',EMAIL_EXISTS:'Account already exists.',WEAK_PASSWORD:'Choose a stronger password.'};throw Error(map[c]||c.replaceAll('_',' ').toLowerCase())}return d
}
declare global{interface Window{google?:any;Razorpay?:any}}
export async function google(){
 const id=import.meta.env.VITE_GOOGLE_CLIENT_ID;if(!id)throw Error('Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.')
 await new Promise<void>((resolve,reject)=>{
 const init=()=>{if(!window.google?.accounts?.id){reject(Error('Google sign-in did not load.'));return}
 window.google.accounts.id.initialize({client_id:id,callback:async(r:any)=>{try{resolve(await api.call('/google_login',{method:'POST',auth:false,body:JSON.stringify({credential:r.credential})}))}catch(e){reject(e)}}})
 const el=document.getElementById('google-target');if(el)window.google.accounts.id.renderButton(el,{theme:'outline',size:'large',text:'continue_with'})
 window.google.accounts.id.prompt()}
 if(window.google?.accounts?.id)init();else{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=init;s.onerror=()=>reject(Error('Google sign-in could not load.'));document.head.appendChild(s)}
 })
}




