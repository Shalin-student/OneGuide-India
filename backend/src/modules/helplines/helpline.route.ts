import express from 'express';
import { getHelplines, createHelpline, updateHelpline, deleteHelpline } from './helpline.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getHelplines)
  .post(protect, authorize('admin'), createHelpline);

router.route('/:id')
  .put(protect, authorize('admin'), updateHelpline)
  .delete(protect, authorize('admin'), deleteHelpline);

export default router;
