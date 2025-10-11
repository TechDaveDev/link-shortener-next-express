import { Router } from 'express';
import { redirectToUrl } from '../controllers/link.controller';

const router = Router();

router.get('/:shortCode', redirectToUrl);

export default router;

