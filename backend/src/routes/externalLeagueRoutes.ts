import { Router } from "express";
import { getExternalLeagues } from "../controllers/externalLeagueController";

const router = Router();

router.get("/", getExternalLeagues);

export default router;
