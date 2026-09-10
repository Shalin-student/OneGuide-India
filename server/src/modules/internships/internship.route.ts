import express from 'express';
import { getInternships, getInternshipBySlug, createInternship, updateInternship, deleteInternship } from './internship.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getInternships)
  .post(protect, authorize('admin'), createInternship);

router.route('/:slug')
  .get(getInternshipBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateInternship)
  .delete(protect, authorize('admin'), deleteInternship);

export default router;
