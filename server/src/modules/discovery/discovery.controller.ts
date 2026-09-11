import { Request, Response } from 'express';
import { resourceRetrievalService } from '../../services/resourceRetrieval.service';
import { mapToLegacyContract } from '../services/service.controller';

export const globalDiscovery = async (req: Request, res: Response) => {
  try {
    const { category, state, search, page, limit, sort } = req.query;
    
    // For global discovery, we DO NOT force a module filter.
    // If a category IS provided by the frontend search, we respect it.
    const filters = {
      module: category ? String(category) : undefined,
      state: state ? String(state) : undefined,
      query: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
    };
    
    const pagination = {
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 50,
    };

    const result = await resourceRetrievalService.searchResources(filters, pagination);

    res.json({ 
      status: 'success', 
      data: result.data.map(mapToLegacyContract),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
