import { Router } from 'express';
import { createLink } from '../controllers/link.controller';

const router = Router();

router.post('/links', createLink);

export default router;