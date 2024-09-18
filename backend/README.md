# Fantasy Backend

This project is a backend service for managing fantasy sports platforms, leagues, teams, and players. It is built using Firebase Firestore, Firebase Functions, and Express.js.

## Table of Contents

- [Fantasy Backend](#fantasy-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
  - [Seeding Data](#seeding-data)
  - [API Endpoints](#api-endpoints)
    - [Fantasy Platforms](#fantasy-platforms)
    - [Platform Credentials](#platform-credentials)
    - [Fantasy Leagues](#fantasy-leagues)
    - [Fantasy Teams](#fantasy-teams)
    - [Fantasy Players](#fantasy-players)
    - [Fantasy Team Players](#fantasy-team-players)
    - [User Management](#user-management)
  - [Authentication](#authentication)
  - [Error Handling](#error-handling)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [Backend Setup](#backend-setup)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies](#install-dependencies)

## Features

- CRUD operations for Fantasy Platforms, Platform Credentials, Fantasy Leagues, Fantasy Teams, Fantasy Players, and Fantasy Team Players.
- Firebase Authentication for securing API endpoints.
- Data validation and error handling.

## Project Structure

```
/backend
  /src
    /controllers
    /middleware
    /models
    /routes
    /seed
    firebase.ts
    index.ts
  package.json
  tsconfig.json
  .eslintrc.js
  .gitignore
  README.md
```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/fantasy-backend.git
   cd fantasy-backend
   ```

2. **Install dependencies:**

   ```bash
   yarn
   ```

3. **Set up Firebase:**

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Set up Firestore and Firebase Authentication.
   - Download the service account key JSON file and place it in the `src` directory. Update the path in `src/firebase.ts`.

4. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   FIREBASE_DATABASE_URL=https://<your-database-name>.firebaseio.com
   ```

5. **Build the project:**

   ```bash
   yarn run build
   ```

6. **Serve the project locally:**

   ```bash
   yarn run serve
   ```

## Seeding Data

To seed initial data for fantasy platforms, run the following command:

```bash
bash
yarn run seed
```

## API Endpoints

### Fantasy Platforms

- **Create Fantasy Platform:**

  - `POST /fantasyPlatforms`
  - Request Body: `{ "id": "string", "displayName": "string", "credentialType": "username" | "email" }`

- **Get Fantasy Platform:**

  - `GET /fantasyPlatforms/:id`

- **Update Fantasy Platform:**

  - `PUT /fantasyPlatforms/:id`
  - Request Body: `{ "displayName": "string", "credentialType": "username" | "email" }`

- **Delete Fantasy Platform:**

  - `DELETE /fantasyPlatforms/:id`

- **List Fantasy Platforms:**
  - `GET /fantasyPlatforms`

### Platform Credentials

- **Create Platform Credential:**

  - `POST /platformCredentials`
  - Request Body: `{ "id": "string", "credentialType": "username" | "email", "credential": "string", "fantasyPlatformId": "string" }`

- **Get Platform Credential:**

  - `GET /platformCredentials/:id`

- **Update Platform Credential:**

  - `PUT /platformCredentials/:id`
  - Request Body: `{ "credentialType": "username" | "email", "credential": "string", "fantasyPlatformId": "string" }`

- **Delete Platform Credential:**

  - `DELETE /platformCredentials/:id`

- **List Platform Credentials:**
  - `GET /platformCredentials`

### Fantasy Leagues

- **Create Fantasy League:**

  - `POST /fantasyLeagues`
  - Request Body: `{ "id": "string", "extId": "string", "name": "string", "fantasyPlatformId": "string", "userId": "string" }`

- **Get Fantasy League:**

  - `GET /fantasyLeagues/:id`

- **Update Fantasy League:**

  - `PUT /fantasyLeagues/:id`
  - Request Body: `{ "extId": "string", "name": "string", "fantasyPlatformId": "string", "userId": "string" }`

- **Delete Fantasy League:**

  - `DELETE /fantasyLeagues/:id`

- **List Fantasy Leagues:**
  - `GET /fantasyLeagues`

### Fantasy Teams

- **Create Fantasy Team:**

  - `POST /fantasyTeams`
  - Request Body: `{ "id": "string", "extId": "string", "name": "string", "userId": "string", "fantasyLeagueId": "string" }`

- **Get Fantasy Team:**

  - `GET /fantasyTeams/:id`

- **Update Fantasy Team:**

  - `PUT /fantasyTeams/:id`
  - Request Body: `{ "extId": "string", "name": "string", "userId": "string", "fantasyLeagueId": "string" }`

- **Delete Fantasy Team:**

  - `DELETE /fantasyTeams/:id`

- **List Fantasy Teams:**
  - `GET /fantasyTeams`

### Fantasy Players

- **Create Fantasy Player:**

  - `POST /fantasyPlayers`
  - Request Body: `{ "id": "string", "name": "string", "team": "string" }`

- **Get Fantasy Player:**

  - `GET /fantasyPlayers/:id`

- **Update Fantasy Player:**

  - `PUT /fantasyPlayers/:id`
  - Request Body: `{ "name": "string", "team": "string" }`

- **Delete Fantasy Player:**

  - `DELETE /fantasyPlayers/:id`

- **List Fantasy Players:**
  - `GET /fantasyPlayers`

### Fantasy Team Players

- **Create Fantasy Team Player:**

  - `POST /fantasyTeamPlayers`
  - Request Body: `{ "fantasyTeamId": "string", "fantasyPlayerId": "string", "starter": "boolean" }`

- **Get Fantasy Team Player:**

  - `GET /fantasyTeamPlayers/:id`

- **Update Fantasy Team Player:**

  - `PUT /fantasyTeamPlayers/:id`
  - Request Body: `{ "fantasyTeamId": "string", "fantasyPlayerId": "string", "starter": "boolean" }`

- **Delete Fantasy Team Player:**

  - `DELETE /fantasyTeamPlayers/:id`

- **List Fantasy Team Players:**
  - `GET /fantasyTeamPlayers`

### User Management

- `POST /users/register`: Register a new user
- `POST /users/login`: Login a user
- `POST /users/change-password`: Change user password
- `GET /users/profile/:uid`: Get user profile
- `PUT /users/profile/:uid`: Update user profile

## Authentication

This project uses Firebase Authentication to secure API endpoints. To access protected routes, include a valid Firebase ID token in the `Authorization` header of your requests:

```plaintext
Authorization: Bearer <your-firebase-id-token>
```

## Error Handling

Errors are handled by the `errorHandler` middleware. If an error occurs, a 500 status code and a message will be returned.

## Testing

To be implemented.

## Deployment

To deploy the project to Firebase, run the following command:

```bash

yarn run deploy
```

# Backend Setup

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Install Dependencies

```
/backend
  /src
    /controllers
    /middleware
    /models
    /routes
    /seed
    firebase.ts
    index.ts
  package.json
  tsconfig.json
  .eslintrc.js
  .gitignore
  README.md
```
