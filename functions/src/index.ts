import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware";
import fantasyPlatformRoutes from "./routes/fantasyPlatformRoutes";
import platformCredentialRoutes from "./routes/platformCredentialRoutes";
import fantasyLeagueRoutes from "./routes/fantasyLeagueRoutes";
import fantasyTeamRoutes from "./routes/fantasyTeamRoutes";
import fantasyPlayerRoutes from "./routes/fantasyPlayerRoutes";
import fantasyTeamPlayerRoutes from "./routes/fantasyTeamPlayerRoutes";
import userRoutes from "./routes/userRoutes";

const logger = functions.logger;
logger.info('Initializing backend');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Error handling middleware
app.use(errorHandler);

app.use("/fantasyPlatforms", fantasyPlatformRoutes);
app.use("/platformCredentials", platformCredentialRoutes);
app.use("/fantasyLeagues", fantasyLeagueRoutes);
app.use("/fantasyTeams", fantasyTeamRoutes);
app.use("/fantasyPlayers", fantasyPlayerRoutes);
app.use("/fantasyTeamPlayers", fantasyTeamPlayerRoutes);
app.use("/users", userRoutes);

export const api = functions.https.onRequest(app);
