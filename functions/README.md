# Firebase Cloud Function Emulator Setup

This guide provides instructions for setting up and running the Firebase Emulator Suite to test your Cloud Functions locally. It also includes steps to manually trigger a Pub/Sub function using a test script.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. It's recommended to use a stable LTS version (e.g., Node.js 18 or 20).
- **Firebase CLI**: Install the Firebase CLI if you haven't already:

  ```bash
  yarn install -g firebase-tools
  ```

- **Project Setup**: Ensure your Firebase project is initialized and configured correctly.

## Setup

1. **Install Dependencies**: Navigate to the `functions` directory and install the necessary dependencies:

   ```bash
   cd functions
   yarn install
   ```

## Running the Emulator

1. **Start the Emulator**: Use the following command to start the Firebase Emulator Suite with the Functions, Pub/Sub, and Firestore emulators:

   ```bash
   yarn run emulate
   ```

   This command uses the script defined in `package.json`:

   ```json
   "scripts": {
     "emulate": "firebase emulators:start --only functions,pubsub,firestore"
   }
   ```

2. **Verify Emulator Status**: Ensure that the emulators are running by checking the terminal output. You should see logs indicating that the Functions, Pub/Sub, and Firestore emulators are active.

## Triggering the Function Manually

1. **Edit the Test Script**: Open `functions/fetchFromSleeper.sh` and ensure the `leagueId` is set correctly:

   ```shell
   # JSON payload with the leagueId
   json_payload='{"leagueId": "1108780053288165376"}'  # Replace with the actual league ID
   ```

2. **Run the Test Script**: Execute the script to manually trigger the Pub/Sub function:

   ```bash
   ./functions/fetchFromSleeper.sh
   ```

3. **Check the Logs**: Monitor the terminal where the emulator is running to see the output of your function. This will include any console logs or errors.

## Notes

- **Environment Variables**: If your function relies on environment variables, ensure they are set in your local environment or use a `.env` file with a package like `dotenv` to load them.
- **Security**: Do not commit sensitive information, such as API keys or secrets, to version control. Use environment variables or secret management tools to handle sensitive data.

## Troubleshooting

- **Emulator Not Starting**: Ensure all dependencies are installed and that there are no port conflicts.
- **Function Not Triggering**: Verify the Pub/Sub message format and ensure the emulator is running.
- **Logs Not Showing**: Check the emulator logs for any errors or warnings that might indicate issues with your setup.

By following these steps, you can effectively test and debug your Firebase Cloud Functions locally using the Firebase Emulator Suite.