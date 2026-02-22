import { Router } from 'express';
import { routeSearchController } from '../../controllers/RouteSearchController';

const router = Router();

// POST /api/v1/history/record - Record new search
router.post('/record', routeSearchController.recordSearch);

// GET /api/v1/history/:fingerprint - Get history for fingerprint
router.get('/:fingerprint', routeSearchController.getHistory);

export default router;
