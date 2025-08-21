# FF TV Guide - Local Development Setup

This guide will help you get the FF TV Guide project running locally with Firebase emulators.

## Prerequisites

- Node.js (v22.5.1 or later)
- Yarn package manager
- Firebase CLI (`npm install -g firebase-tools`)

## Project Structure

```
ff-tv-guide/
├── backend/          # Express.js API server
├── frontend/         # React + Vite frontend
├── functions/        # Firebase Cloud Functions
└── firebase.json     # Firebase configuration
```

## Setup Steps

### 1. Install Dependencies

Install dependencies for all parts of the project:

```bash
# Backend dependencies
cd backend
yarn install

# Frontend dependencies
cd ../frontend
yarn install

# Functions dependencies (optional)
cd ../functions
yarn install
```

### 2. Environment Configuration

The project uses Firebase emulators for local development. The frontend is already configured to connect to emulators when in development mode.

**Backend Environment Variables:**
Create a `.env.development` file in the `backend/` directory:

```env
NODE_ENV=development
FB_PROJECT_ID=your-project-id
FB_STORAGE_BUCKET=your-project-id.appspot.com
GCP_PROJECT_ID=your-project-id
```

**Frontend Environment Variables:**
Create a `.env` file in the `frontend/` directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Start Firebase Emulators

From the project root directory:

```bash
firebase emulators:start
```

This will start:
- Firestore emulator on port 8080
- Auth emulator on port 9099
- Hosting emulator on port 5000
- Functions emulator on port 5001
- PubSub emulator on port 8085
- Emulator UI on port 4000

### 4. Start the Backend Server

In a new terminal, from the `backend/` directory:

```bash
# Development mode with hot reload
yarn run serve:dev

# Or build and run
yarn run build
yarn run start
```

The backend server will start on the default Express port (likely 3000).

### 5. Start the Frontend Development Server

In another terminal, from the `frontend/` directory:

```bash
yarn dev
```

The frontend will start on the default Vite port (likely 5173).

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firebase Hosting**: http://localhost:5000

## Development Workflow

1. **Firebase Emulators**: Keep running in the background
2. **Backend**: Use `yarn run serve:dev` for development with hot reload
3. **Frontend**: Use `yarn dev` for development with hot reload

## Available Scripts

### Backend (`backend/package.json`)
- `yarn run serve:dev` - Start development server with nodemon
- `yarn run build` - Build TypeScript to JavaScript
- `yarn run start` - Start production server
- `yarn run emulate` - Start Firebase emulators (Firestore + Auth)
- `yarn run lint` - Run ESLint

### Frontend (`frontend/package.json`)
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 8080, 9099, 5000, 5001, 8085, 4000, 5173, and 3000 are available
2. **Firebase CLI not found**: Install with `npm install -g firebase-tools`
3. **Node version**: Ensure you're using Node.js v22.5.1 or later
4. **Environment variables**: Make sure all required environment variables are set

### Reset Emulator Data

To clear emulator data and start fresh:

```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

### View Emulator Logs

Check the emulator logs in the Firebase Emulator UI at http://localhost:4000 or in the terminal where emulators are running.

## Production Deployment

When ready to deploy:

```bash
# Deploy backend
cd backend
yarn run deploy

# Deploy frontend
cd ../frontend
yarn run deploy
```

## Additional Notes

- The project uses Firebase Firestore for the database
- Authentication is handled by Firebase Auth
- The backend serves as an API layer between the frontend and Firebase
- Cloud Functions are available for background tasks
- The frontend automatically connects to emulators in development mode 