import express from 'express';
import { globalDiscovery } from './discovery.controller';

const router = express.Router();

router.route('/')
  .get(globalDiscovery);

export default router;
