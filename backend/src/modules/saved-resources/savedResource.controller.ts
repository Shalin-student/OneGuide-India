import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { SavedResource } from './savedResource.model';
import { resourceRetrievalService } from '../../services/resourceRetrieval.service';
import { mapToLegacyContract } from '../services/service.controller';

export const saveResource = async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, resourceType } = req.body;
    
    if (!resourceId || !resourceType) {
      return res.status(400).json({ status: 'error', message: 'resourceId and resourceType are required' });
    }

    // Validate that the underlying resource actually exists
    const resource = await resourceRetrievalService.getResourceById(resourceId);
    if (!resource) {
      return res.status(404).json({ status: 'error', message: 'Underlying resource not found' });
    }

    // Try to create the saved resource
    try {
      const saved = await SavedResource.create({
        userId: req.user!._id,
        resourceId,
        resourceType
      });
      return res.status(201).json({ status: 'success', data: saved });
    } catch (err: any) {
      // Handle MongoDB duplicate key error gracefully (code 11000)
      if (err.code === 11000) {
        return res.status(200).json({ status: 'success', message: 'Resource already saved' });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getSavedResources = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await SavedResource.countDocuments({ userId: req.user!._id });
    const savedDocs = await SavedResource.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Fetch the actual canonical resources in parallel
    const resourcePromises = savedDocs.map(async (doc) => {
      const canonical = await resourceRetrievalService.getResourceById(doc.resourceId);
      if (!canonical) return null; // Orphaned resource, perhaps deleted
      
      return {
        ...mapToLegacyContract(canonical),
        savedAt: doc.createdAt // Attach bookmark metadata
      };
    });

    const resolvedResources = await Promise.all(resourcePromises);
    const validResources = resolvedResources.filter(r => r !== null);

    res.json({
      status: 'success',
      data: validResources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const removeSavedResource = async (req: AuthRequest, res: Response) => {
  try {
    const { resourceType, resourceId } = req.params;

    const deleted = await SavedResource.findOneAndDelete({
      userId: req.user!._id,
      resourceId,
      resourceType
    });

    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Saved resource not found' });
    }

    res.json({ status: 'success', message: 'Resource removed from saved list' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getSavedResourceKeys = async (req: AuthRequest, res: Response) => {
  try {
    const savedDocs = await SavedResource.find({ userId: req.user!._id }).select('resourceId resourceType');
    
    // Return a lightweight array of strings: "resourceType:resourceId"
    const keys = savedDocs.map(doc => `${doc.resourceType}:${doc.resourceId}`);
    
    res.json({ status: 'success', data: keys });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
