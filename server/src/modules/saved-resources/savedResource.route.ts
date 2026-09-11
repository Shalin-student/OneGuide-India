import express from 'express';
import { protect } from '../../middleware/auth.middleware';
import { saveResource, getSavedResources, removeSavedResource, getSavedResourceKeys } from './savedResource.controller';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .post(saveResource)
  .get(getSavedResources);

router.get('/keys', getSavedResourceKeys);

router.delete('/:resourceType/:resourceId', removeSavedResource);

export default router;
