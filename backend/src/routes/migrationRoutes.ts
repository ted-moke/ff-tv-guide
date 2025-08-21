import { Router } from "express";
import { runMigration, runSingleLeagueMigration } from "../controllers/migrationController";
import { authenticate } from "../middleware/authMiddleware";
import { seedTestDataForMigration } from "../seed";

const router = Router();

// Migration route - requires authentication for safety
router.post("/add-league-master", authenticate, runMigration);

// Single league migration route - requires authentication for safety
router.post("/single-league", authenticate, runSingleLeagueMigration);

// Test data seeding route
router.post("/seed-test-data", authenticate, async (req, res) => {
  try {
    await seedTestDataForMigration();
    res.json({
      success: true,
      message: "Test data seeded successfully"
    });
  } catch (error) {
    console.error("Test data seeding failed:", error);
    res.status(500).json({
      success: false,
      error: "Test data seeding failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
