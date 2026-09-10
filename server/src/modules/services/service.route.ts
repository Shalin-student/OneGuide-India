import express from 'express';
import { getServices, getServiceById, getServiceBySlug, createService, updateService, deleteService, getRecommendations } from './service.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

router.post('/recommendations', getRecommendations);

router.get('/slug/:slug', getServiceBySlug);

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorize('admin'), updateService)
  .delete(protect, authorize('admin'), deleteService);

export default router;
