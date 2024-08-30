import * as functions from "firebase-functions";
import express from "express";
import { authenticate } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorMiddleware";
import fantasyPlatformRoutes from "./routes/fantasyPlatformRoutes";
import platformCredentialRoutes from "./routes/platformCredentialRoutes";
import fantasyLeagueRoutes from "./routes/fantasyLeagueRoutes";
import fantasyTeamRoutes from "./routes/fantasyTeamRoutes";
import fantasyPlayerRoutes from "./routes/fantasyPlayerRoutes";
import fantasyTeamPlayerRoutes from "./routes/fantasyTeamPlayerRoutes";
import platformsRouter from "./routes/platforms";

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(authenticate); // Apply authentication middleware to all routes
app.use("/fantasyPlatforms", fantasyPlatformRoutes);
app.use("/platformCredentials", platformCredentialRoutes);
app.use("/fantasyLeagues", fantasyLeagueRoutes);
app.use("/fantasyTeams", fantasyTeamRoutes);
app.use("/fantasyPlayers", fantasyPlayerRoutes);
app.use("/fantasyTeamPlayers", fantasyTeamPlayerRoutes);
app.use("/api/platforms", platformsRouter);
app.use(errorHandler); // Apply error handling middleware

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export const api = functions.https.onRequest(app);
