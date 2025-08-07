# Environment Variables Setup

This application requires several environment variables to be set up:

## Firebase Configuration
1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Authentication with Google provider
4. Get your Firebase config and add to `.env.local`:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

## Google OAuth Setup
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. Add to `.env.local`:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET

## NextAuth Configuration
1. Generate a random secret for NEXTAUTH_SECRET
2. Set NEXTAUTH_URL to your domain (http://localhost:3000 for development)

## App Configuration
- NEXT_PUBLIC_TURNS_PER_DAY: Number of message retrieval turns per user per day
- CAESAR_CIPHER_SHIFT: Shift value for Caesar cipher encryption

Copy `.env.local` and fill in your actual values.
