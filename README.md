# AROX customer web app
React + TypeScript + Vite customer portal. Copy .env.example to .env.local, run npm install, then npm run dev.
VITE_API_URL is configurable. Firebase Email/Password uses VITE_FIREBASE_API_KEY. Google uses VITE_GOOGLE_CLIENT_ID. Razorpay uses only the public VITE_RAZORPAY_KEY_ID; keep the secret server-side.
The Flask API requires CORS_ALLOWED_ORIGINS to include the exact deployed HTTPS origin. Browser CORS and endpoint contracts have not been verified from the deployed web origin.
Payment shows confirmed only after /payment/status reports paid and an active job status. Browser callback alone is not trusted. Camera capture takes one page photo and is not native multi-page edge-corrected scanning. HTTPS is required for launch; auth token is kept in sessionStorage and clears when the browser session ends.



