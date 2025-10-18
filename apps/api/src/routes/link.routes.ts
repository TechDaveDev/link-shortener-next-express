import { Router } from 'express';
import { createLink, getAllLinks, getStats } from '../controllers/link.controller';

const router = Router();

router.post('/links', createLink);

router.get('/links', getAllLinks);

router.get('/stats', getStats);

export default router;