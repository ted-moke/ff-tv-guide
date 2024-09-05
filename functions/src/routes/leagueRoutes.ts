import { Router } from 'express';
import { upsertLeague } from '../controllers/leagueController';

const router = Router();

router.post('/', upsertLeague);

export default router;