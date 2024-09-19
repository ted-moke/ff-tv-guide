import { Router } from "express";
import {
  removeUserTeamsDuplicates,
  getUserTeamsDuplicates,
} from "../controllers/userTeamController";

const router = Router();

router.post("/remove-duplicates", removeUserTeamsDuplicates);
router.get("/duplicates", getUserTeamsDuplicates);

export default router;
