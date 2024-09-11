import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware";
import { seedDatabase } from "./seed";
import platformRoutes from "./routes/platformRoutes";
import leagueRoutes from "./routes/leagueRoutes";
import teamRoutes from "./routes/teamRoutes";
import teamPlayerRoutes from "./routes/teamPlayerRoutes";
import userRoutes from "./routes/userRoutes";
import platformCredentialRoutes from "./routes/platformCredentialRoutes";
import externalLeagueRoutes from "./routes/externalLeagueRoutes";

const app = express();

console.log("Starting server");

const allowedOrigins = [
  'http://localhost:5173', // Development URL
  'https://fantasy-tv-guide.web.app' // Production URL
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("origin", origin);
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

// Logging middleware
app.use((req, res, next) => {
  next();
});

app.use("/platforms", platformRoutes);
app.use("/platform-credentials", platformCredentialRoutes);
app.use("/leagues", leagueRoutes);
app.use("/teams", teamRoutes);
app.use("/team-players", teamPlayerRoutes);
app.use("/users", userRoutes);
app.use("/external-leagues", externalLeagueRoutes);

app.get("/health", (req, res) => {
  res.send("OK");
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
