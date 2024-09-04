import { Router } from 'express';
import { getAllPlatforms, getPlatformById } from '../controllers/platformController';

const router = Router();

router.get('/', getAllPlatforms);
router.get('/:id', getPlatformById);

export default router;