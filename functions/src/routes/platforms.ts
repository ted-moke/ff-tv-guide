import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const platforms = ["Platform1", "Platform2", "Platform3"]; // Replace with actual platform data
  res.json(platforms);
});

export default router;
