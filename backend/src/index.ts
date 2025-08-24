import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import { seedDatabase } from "./seed";
import { getDeploymentInfo } from "./utils/deploymentInfo";
import platformRoutes from "./routes/platformRoutes";
import leagueRoutes from "./routes/leagueRoutes";
import teamPlayerRoutes from "./routes/teamPlayerRoutes";
import userRoutes from "./routes/userRoutes";
import platformCredentialRoutes from "./routes/platformCredentialRoutes";
import externalLeagueRoutes from "./routes/externalLeagueRoutes";
import userTeamRoutes from "./routes/userTeamRoutes";
import userTeamHistoryRoutes from "./routes/userTeamHistoryRoutes";
import tradeRoutes from "./routes/tradeRoutes";
import migrationRoutes from "./routes/migrationRoutes";
import cacheRoutes from "./routes/cacheRoutes";
const app = express();

console.log("Starting server");

const allowedOrigins = [
  'http://localhost:5173', // Development URL
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/^https?:\/\//, 'https://www.') || ''
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Cache control middleware - prevent aggressive caching
app.use((req, res, next) => {
  // Set cache control headers to prevent caching of API responses
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Logging middleware
app.use((req, res, next) => {
  if (req.path !== "/health" && req.path !== "/users/verify-token") {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

app.use("/platforms", platformRoutes);
app.use("/platform-credentials", platformCredentialRoutes);
app.use("/leagues", leagueRoutes);
app.use("/team-players", teamPlayerRoutes);
app.use("/users", userRoutes);
app.use("/external-leagues", externalLeagueRoutes);
app.use("/user-teams", userTeamRoutes);
app.use("/user-team-history", userTeamHistoryRoutes);
app.use("/trades", tradeRoutes);
app.use("/migration", migrationRoutes);
app.use("/cache", cacheRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    ...getDeploymentInfo()
  });
});

// Error handling middleware should be last
app.use(errorHandler);

// Seed the database when the app initializes
seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
