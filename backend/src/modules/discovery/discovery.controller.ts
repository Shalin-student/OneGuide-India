import { Request, Response } from 'express';
import { resourceRetrievalService } from '../../services/resourceRetrieval.service';
import { mapToLegacyContract } from '../services/service.controller';

export const globalDiscovery = async (req: Request, res: Response) => {
  try {
    const { category, state, search, page, limit, sort, gender, socialCategory, employmentStatus, disabilityStatus, minorityStatus, maritalStatus, age, residence, benefitType, qualification, jobType, student, bpl, governmentEmployee, economicDistress, income } = req.query;
    
    // For global discovery, we DO NOT force a module filter.
    // If a category IS provided by the frontend search, we respect it.
    const filters = {
      module: category ? String(category) : undefined,
      state: state ? String(state) : undefined,
      query: search ? String(search) : undefined,
      sort: sort ? String(sort) : undefined,
      gender: gender ? String(gender) : undefined,
      socialCategory: socialCategory ? String(socialCategory) : undefined,
      employmentStatus: employmentStatus ? String(employmentStatus) : undefined,
      disabilityStatus: disabilityStatus === 'true' || disabilityStatus === 'Yes' ? 'Yes' : undefined,
      minorityStatus: minorityStatus === 'true' || minorityStatus === 'Yes' ? 'Yes' : undefined,
      maritalStatus: maritalStatus ? String(maritalStatus) : undefined,
      age: age ? parseInt(String(age), 10) : undefined,
      residence: residence ? String(residence) : undefined,
      benefitType: benefitType ? String(benefitType) : undefined,
      qualification: qualification ? String(qualification) : undefined,
      jobType: jobType ? String(jobType) : undefined,
      student: student === 'true' || student === 'Yes' ? true : (student === 'false' ? false : undefined),
      bpl: bpl === 'true' || bpl === 'Yes' ? true : (bpl === 'false' ? false : undefined),
      governmentEmployee: governmentEmployee === 'true' || governmentEmployee === 'Yes' ? true : (governmentEmployee === 'false' ? false : undefined),
      economicDistress: economicDistress === 'true' || economicDistress === 'Yes' ? true : (economicDistress === 'false' ? false : undefined),
      income: income ? String(income) : undefined,
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
