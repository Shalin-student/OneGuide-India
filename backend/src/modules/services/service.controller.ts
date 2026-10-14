import { Request, Response } from 'express';
import { Service } from './service.model';
import { Category } from '../categories/category.model';
import { resourceRetrievalService } from '../../services/resourceRetrieval.service';
import { GovernmentResource } from '../../services/resourceNormalization.service';

/**
 * Maps the new Canonical DTO back to the legacy frontend contract
 * temporarily to prevent UI breakage during migration.
 */
export const mapToLegacyContract = (resource: GovernmentResource) => {
  return {
    ...resource,
    _id: resource.id,
    categoryId: {
      name: resource.module,
      slug: resource.module.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    },
    governmentDepartment: resource.authority,
    stateOrCentral: resource.location?.level || 'Central',
    state: resource.location?.state,
    applicationProcess: resource.application?.processSteps,
    eligibility: resource.eligibility?.overview || (resource.eligibility ? JSON.stringify(resource.eligibility) : ''),
    sourceUrl: resource.officialSources?.[0]?.sourceURL,
    sources: resource.officialSources?.map(s => ({ title: s.sourceName, url: s.sourceURL })),
    ...resource.searchMetadata, // spreads salary, vacancies, fees, etc.
  };
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, state, search, page, limit } = req.query;

    const filters = {
      module: category ? String(category) : 'services',
      state: state ? String(state) : undefined,
      query: search ? String(search) : undefined,
    };

    const pagination = {
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 50, // Default 50 to maintain backwards compatibility size for unpaginated frontends
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

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await resourceRetrievalService.getResourceById(String(req.params.id));
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });

    // Fetch related resources and embed them in the response
    const relatedResources = await resourceRetrievalService.getRelatedResources(service);

    res.json({ status: 'success', data: { ...service, relatedResources } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const service = await resourceRetrievalService.getResourceBySlug(String(req.params.slug));
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });

    // Fetch related resources and embed them in the response
    const relatedResources = await resourceRetrievalService.getRelatedResources(service);

    res.json({ status: 'success', data: { ...service, relatedResources } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ status: 'success', data: service });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });
    res.json({ status: 'success', data: service });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });
    res.json({ status: 'success', message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { age, state, occupation, category, disability, isStudent, bpl } = req.body;
    const services = await Service.find({ status: 'Active' }).populate('categoryId', 'name slug');

    const scoredServices = services.map(service => {
      let score = 0;
      if (service.stateOrCentral === 'Central') score += 10;
      else if (service.state && state && service.state.toLowerCase() === state.toLowerCase()) score += 20;

      if (occupation && service.eligibility.occupations && service.eligibility.occupations.includes(occupation)) score += 20;
      if (isStudent && service.eligibility.studentRequired) score += 20;
      if (category && service.eligibility.socialCategories && service.eligibility.socialCategories.includes(category)) score += 15;
      if (bpl && service.eligibility.bplRequired) score += 15;
      if (disability && service.eligibility.disabilityRequired) score += 15;
      if (age && service.eligibility.ageRange) {
        if ((!service.eligibility.ageRange.min || age >= service.eligibility.ageRange.min) &&
          (!service.eligibility.ageRange.max || age <= service.eligibility.ageRange.max)) {
          score += 10;
        }
      }
      return { service, score };
    });

    scoredServices.sort((a, b) => b.score - a.score);
    const recommendations = scoredServices.slice(0, 10).map(s => s.service);

    res.json({ status: 'success', data: recommendations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getExploreStats = async (req: Request, res: Response) => {
  try {
    const categoryStats = await Category.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'services'
        }
      },
      {
        $project: {
          _id: 1,
          title: '$name',
          count: { $size: '$services' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const centralCount = await Service.countDocuments({ stateOrCentral: 'Central' });

    const stateStatsAgg = await Service.aggregate([
      { $match: { stateOrCentral: 'State', state: { $ne: null } } },
      { $group: { _id: '$state', stateCount: { $sum: 1 } } },
      { $project: { _id: 0, title: '$_id', stateCount: 1 } },
      { $sort: { title: 1 } }
    ]);

    const stateStats = stateStatsAgg.map((s: any) => ({
      title: s.title,
      stateCount: s.stateCount,
      centralCount: centralCount
    }));

    const ministryStats = await Service.aggregate([
      { $match: { governmentDepartment: { $nin: [null, ''] } } },
      { $group: { _id: '$governmentDepartment', count: { $sum: 1 } } },
      { $project: { _id: 0, title: '$_id', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      status: 'success',
      data: { categories: categoryStats, states: stateStats, ministries: ministryStats }
    });

  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
