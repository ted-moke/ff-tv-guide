# FF TV Guide - Deployment Guide

This guide will help you deploy the FF TV Guide application to production.

## Project Overview

This is a **Fantasy Football TV Guide** application with:
- **Frontend**: React + Vite (hosted on Firebase Hosting)
- **Backend**: Express.js API (deployed on Google Cloud Run)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Cloud Functions**: Firebase Functions

## Prerequisites

Before deploying, ensure you have:

- **Node.js** v22.5.1 or later
- **Firebase CLI**: `npm install -g firebase-tools`
- **Google Cloud CLI** (for backend deployment)
- **Yarn** package manager
- Access to the `fantasy-tv-guide` Firebase project

## Setup Steps

### 1. Login to Firebase

```bash
firebase login
```

### 2. Set up Environment Variables

#### Backend Environment Variables

Create `backend/.env.production`:

```env
NODE_ENV=production
FB_PROJECT_ID=[your-app-id]
FB_STORAGE_BUCKET=[your-app-id].appspot.com
GCP_PROJECT_ID=[your-app-id]
```

#### Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=[your-app-id].firebaseapp.com
VITE_FIREBASE_PROJECT_ID=[your-app-id]
VITE_FIREBASE_STORAGE_BUCKET=[your-app-id].appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Note**: You'll need to get the actual Firebase config values from your Firebase console.

### 3. Deploy Backend

```bash
cd backend
yarn install
yarn run deploy
```

This will:
- Deploy Firestore rules and indexes
- Deploy the Express.js API to Google Cloud Run

### 4. Deploy Frontend

```bash
cd frontend
yarn install
yarn build
yarn run deploy
```

This will:
- Build the React app for production
- Deploy to Firebase Hosting

### 5. Deploy Cloud Functions (Optional)

```bash
cd functions
yarn install
firebase deploy --only functions
```

## Alternative: Deploy Everything at Once

From the project root:

```bash
# Deploy all Firebase services (hosting, firestore, functions)
firebase deploy

# Then deploy backend separately
cd backend
yarn run deploy
```

## Access Your Deployed Application

- **Frontend**: https://fantasy-tv-guide.web.app
- **Backend API**: https://ff-tv-guide-[hash]-[region].a.run.app

