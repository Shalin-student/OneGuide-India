import express from 'express';
import { getDocuments, getDocumentBySlug, createDocument, updateDocument, deleteDocument } from './document.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getDocuments)
  .post(protect, authorize('admin'), createDocument);

router.route('/:slug')
  .get(getDocumentBySlug);

router.route('/:id')
  .put(protect, authorize('admin'), updateDocument)
  .delete(protect, authorize('admin'), deleteDocument);

export default router;
