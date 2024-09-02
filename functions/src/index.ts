import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { authenticate } from "./middleware/authMiddleware";
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
const port = process.env.APP_PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from your frontend's origin or all origins if not set
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// app.use(authenticate); // Authentication middleware is commented out

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, { body: req.body });
  next();
});

app.use("/fantasyPlatforms", fantasyPlatformRoutes);
app.use("/platformCredentials", platformCredentialRoutes);
app.use("/fantasyLeagues", fantasyLeagueRoutes);
app.use("/fantasyTeams", fantasyTeamRoutes);
app.use("/fantasyPlayers", fantasyPlayerRoutes);
app.use("/fantasyTeamPlayers", fantasyTeamPlayerRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error occurred:', err);
  errorHandler(err, req, res, next);
});

// app.listen is removed for Firebase Functions

export const api = functions.https.onRequest(app);
