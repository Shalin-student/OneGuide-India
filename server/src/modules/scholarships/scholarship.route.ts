import express from 'express';
import { getScholarships, getScholarshipBySlug, createScholarship, updateScholarship, deleteScholarship } from './scholarship.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getScholarships)
  .post(protect, authorize('admin'), createScholarship);

router.route('/:slug')
  .get(getScholarshipBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateScholarship)
  .delete(protect, authorize('admin'), deleteScholarship);

export default router;
