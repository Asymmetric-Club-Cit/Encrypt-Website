# Secret Messages - Interactive Event Application

This is a Next.js application that powers a unique interactive event with three phases of anonymous message submission, retrieval, and decryption.

## Features

### Phase 1: Anonymous Message Submission
- Users can anonymously submit short text messages (max 500 characters)
- Messages are encrypted using Caesar cipher
- Both original and encrypted messages are stored in Firebase Firestore
- Users receive a unique Submission ID as proof of contribution

### Phase 2: Authenticated Message Retrieval
- Google Authentication required
- Limited turns per user per day (configurable)
- Random lottery system for message retrieval
- Messages are claimed to ensure each is received by only one person
- Users can view, copy, and download encrypted messages

### Phase 3: Message Decryption
- Auto-decryption for authenticated users' retrieved messages
- Manual decryption for any encrypted message
- Download decrypted messages as text files

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Authentication**: NextAuth.js with Google Provider
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Encryption**: Caesar Cipher
- **TypeScript**: Full type safety

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Firebase project created
- Google Cloud Console project with OAuth credentials

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Firestore security rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if true; // Adjust based on your security needs
    }
    
    // User turns collection
    match /userTurns/{turnId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Enable Authentication with Google provider
5. Get your Firebase configuration from Project Settings

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 4. Environment Variables
1. Copy `.env.local` file and fill in your values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXT_PUBLIC_TURNS_PER_DAY=3
CAESAR_CIPHER_SHIFT=7
```

### 5. Installation and Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Application Flow

1. **Submit Messages** (`/`) - Users submit anonymous messages
2. **Retrieve Messages** (`/retrieve`) - Authenticated users claim random messages
3. **Decrypt Messages** (`/decrypt`) - Users decrypt their claimed messages or any encrypted text

## Configuration

- **NEXT_PUBLIC_TURNS_PER_DAY**: Number of message retrieval turns per user per day
- **CAESAR_CIPHER_SHIFT**: Shift value for Caesar cipher (default: 7)

## Security Considerations

- Messages are encrypted with Caesar cipher (basic encryption for event purposes)
- User authentication via Google OAuth
- Firestore security rules should be configured for production
- Environment variables should be properly secured

## Deployment

The application can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- Railway
- Self-hosted

Make sure to update environment variables for production deployment.

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify all Firebase environment variables
   - Check Firebase project permissions
   - Ensure Firestore is enabled

2. **Authentication Issues**
   - Verify Google OAuth credentials
   - Check redirect URIs configuration
   - Ensure NEXTAUTH_SECRET is set

3. **Build Issues**
   - Clear `.next` folder and rebuild
   - Check TypeScript errors
   - Verify all dependencies are installed

### Support

For issues and questions, please check the setup documentation or create an issue in the repository.
