# FF TV Guide

## Local Development Setup

If you want to test locally before deploying:

### 1. Start Firebase Emulators

```bash
cd backend
yarn run emulate
```

### 2. Start Backend (in another terminal)

```bash
cd backend
yarn run serve:dev
```

### 3. Start Frontend (in another terminal)

```bash
cd frontend
yarn dev
```

### 4. Access Local Development

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firebase Hosting**: http://localhost:5000

## Available Scripts

### Backend (`backend/package.json`)
- `yarn run serve:dev` - Start development server with nodemon
- `yarn run build` - Build TypeScript to JavaScript
- `yarn run start` - Start production server
- `yarn run emulate` - Start Firebase emulators (Firestore + Auth)
- `yarn run deploy` - Deploy to production
- `yarn run lint` - Run ESLint

### Frontend (`frontend/package.json`)
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn deploy` - Deploy to Firebase Hosting
- `yarn lint` - Run ESLint

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 8080, 9099, 5000, 5001, 8085, 4000, 5173, and 3000 are available for local development
2. **Firebase CLI not found**: Install with `npm install -g firebase-tools`
3. **Node version**: Ensure you're using Node.js v22.5.1 or later
4. **Environment variables**: Make sure all required environment variables are set
5. **Google Cloud CLI**: Ensure you're authenticated with `gcloud auth login`

### Reset Emulator Data

To clear emulator data and start fresh:

```bash
firebase emulators:start --import=./emulator-data --export-on-exit
```

### View Emulator Logs

Check the emulator logs in the Firebase Emulator UI at http://localhost:4000 or in the terminal where emulators are running.

## Important Notes

1. **Firebase Project**: Your app is configured to use the `fantasy-tv-guide` Firebase project
2. **Environment Variables**: You'll need to get the actual Firebase config values from your Firebase console
3. **Google Cloud Run**: The backend uses Cloud Run for deployment, which requires Google Cloud CLI setup
4. **Secrets**: The backend uses Google Secret Manager for sensitive data
5. **Build Process**: The frontend build process compiles TypeScript and creates optimized production assets

## Security Considerations

- Keep your Firebase service account keys secure
- Use environment variables for sensitive configuration
- Regularly update dependencies
- Monitor your Firebase usage and costs

## Support

If you encounter issues during deployment:

1. Check the Firebase console for deployment logs
2. Verify all environment variables are correctly set
3. Ensure you have the necessary permissions for the Firebase project
4. Check that all dependencies are properly installed
