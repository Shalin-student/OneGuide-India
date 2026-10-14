import express from 'express';
import { getSchemes, getSchemeBySlug, createScheme, updateScheme, deleteScheme } from './scheme.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getSchemes)
  .post(protect, authorize('admin'), createScheme);

router.route('/:slug')
  .get(getSchemeBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateScheme)
  .delete(protect, authorize('admin'), deleteScheme);

export default router;
