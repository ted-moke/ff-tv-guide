import { Router } from "express";
import {
  removeUserTeamsDuplicates,
  getUserTeamsDuplicates,
  getAllUserTeamsPaginated,
} from "../controllers/userTeamController";

const router = Router();

router.post("/remove-duplicates", removeUserTeamsDuplicates);
router.get("/duplicates", getUserTeamsDuplicates);
router.get("/", getAllUserTeamsPaginated);

export default router;
