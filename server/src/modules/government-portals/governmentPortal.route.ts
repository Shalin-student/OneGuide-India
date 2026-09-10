import express from 'express';
import { getGovernmentPortals, getGovernmentPortalBySlug, createGovernmentPortal, updateGovernmentPortal, deleteGovernmentPortal } from './governmentPortal.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getGovernmentPortals)
  .post(protect, authorize('admin'), createGovernmentPortal);

router.route('/:slug')
  .get(getGovernmentPortalBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateGovernmentPortal)
  .delete(protect, authorize('admin'), deleteGovernmentPortal);

export default router;
