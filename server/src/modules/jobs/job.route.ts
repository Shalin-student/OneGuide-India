import express from 'express';
import { getJobs, getJobBySlug, createJob, updateJob, deleteJob } from './job.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin'), createJob);

router.route('/:slug')
  .get(getJobBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateJob)
  .delete(protect, authorize('admin'), deleteJob);

export default router;
