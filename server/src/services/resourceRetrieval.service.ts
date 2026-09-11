import { Scheme } from '../modules/schemes/scheme.model';
import { Job } from '../modules/jobs/job.model';
import { Internship } from '../modules/internships/internship.model';
import { Scholarship } from '../modules/scholarships/scholarship.model';
import { GovDocument } from '../modules/documents/document.model';
import { GovernmentPortal } from '../modules/government-portals/governmentPortal.model';
import { Service } from '../modules/services/service.model';

import {
  GovernmentResource,
  normalizeScheme,
  normalizeJob,
  normalizeInternship,
  normalizeScholarship,
  normalizeDocument,
  normalizeGovernmentPortal,
  normalizeService,
} from './resourceNormalization.service';

interface SearchFilters {
  query?: string;
  module?: string;
  state?: string;
  status?: string;
  sort?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  data: GovernmentResource[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---------------------------------------------------------
// QUERY NORMALIZATION & INTENT HINTS
// ---------------------------------------------------------

const STOP_WORDS = new Set([
  'what', 'which', 'how', 'can', 'are', 'is', 'the', 'for', 'me', 
  'available', 'to', 'in', 'of', 'a', 'an', 'government'
]);

const SYNONYM_MAP: Record<string, string> = {
  farmer: 'agriculture',
  farmers: 'agriculture',
  farming: 'agriculture',
  kisan: 'agriculture',
  agri: 'agriculture',
  
  job: 'jobs',
  employment: 'jobs',
  exam: 'jobs',
  exams: 'jobs',
  recruitment: 'jobs',
  
  scholarship: 'scholarships',
  'financial aid': 'scholarships',
  'student scholarship': 'scholarships',
  
  internship: 'internships',
  'training opportunity': 'internships',
  
  aadhaar: 'aadhaar',
  aadhar: 'aadhaar',
  uidai: 'aadhaar',
  
  scheme: 'schemes',
  yojana: 'schemes',
  yojanas: 'schemes',
  
  document: 'documents',
  certificate: 'documents',
  certificates: 'documents',
  
  portal: 'portals',
  website: 'portals',
  'online portal': 'portals',
  
  service: 'services'
};

function normalizeQuery(rawQuery: string): string[] {
  if (!rawQuery) return [];
  const lower = rawQuery.toLowerCase().replace(/[^\w\s]/g, ' ');
  let tokens = lower.split(/\s+/).filter(t => t.length > 0 && !STOP_WORDS.has(t));
  
  // Basic synonym matching
  tokens = tokens.map(t => SYNONYM_MAP[t] || t);
  return [...new Set(tokens)]; // unique tokens
}

function deriveIntent(tokens: string[]): { intent: string | null, domain: string | null } {
  let intent: string | null = null;
  let domain: string | null = null;
  
  if (tokens.includes('agriculture')) domain = 'agriculture';
  
  if (tokens.includes('schemes')) intent = 'schemes';
  else if (tokens.includes('jobs')) intent = 'jobs';
  else if (tokens.includes('scholarships')) intent = 'scholarships';
  else if (tokens.includes('internships')) intent = 'internships';
  else if (tokens.includes('documents') || tokens.includes('aadhaar')) intent = 'documents';
  else if (tokens.includes('portals')) intent = 'portals';
  else if (tokens.includes('services')) intent = 'services';
  
  return { intent, domain };
}

// ---------------------------------------------------------

/**
 * Executes a text search or fallback regex search on a given Mongoose model.
 */
async function searchModel(model: any, query: any, textSearchStr?: string, limit: number = 50) {
  let finalQuery = { ...query };
  
  if (textSearchStr) {
    try {
      // Attempt text index search if exists
      const textResults = await model.find({ ...finalQuery, $text: { $search: textSearchStr } })
        .limit(limit)
        .lean();
      if (textResults && textResults.length > 0) return textResults;
    } catch (e) {
      // Index might not exist, proceed to regex fallback
    }
    
    // SAFE REGEX FALLBACK
    const safeRegexStr = textSearchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeRegexStr, 'i');
    
    finalQuery = {
      ...finalQuery,
      $or: [
        { name: regex },
        { title: regex },
        { description: regex },
        { shortDescription: regex },
        { eligibility: regex },
        { 'eligibility.overview': regex },
        { benefits: regex },
        { 'searchMetadata.keywords': regex },
        { 'category.name': regex }
      ]
    };
  }

  return await model.find(finalQuery).limit(limit).lean();
}

/**
 * Shared service for retrieving government resources across all collections.
 * Avoids loading the entire database into memory by enforcing strict limits
 * and mapping directly at the retrieval boundary.
 */
export const resourceRetrievalService = {
  
  async searchResources(
    filters: SearchFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult> {
    const page = Math.max(1, pagination.page || 1);
    const limit = Math.min(100, Math.max(1, pagination.limit || 20)); // Max 100 per request
    
    const dbQuery: any = {};
    if (filters.status) dbQuery.status = filters.status;
    if (filters.state) {
      dbQuery.$or = [
        { state: { $regex: new RegExp(`^${filters.state}$`, 'i') } },
        { stateOrCentral: 'Central' },
        { level: 'Central' }
      ];
    }

    const maxItemsPerCollection = limit * page; // Fetch enough to satisfy the page
    
    const lookups = [];

    // Scheme
    if (!filters.module || filters.module === 'government-schemes' || filters.module === 'schemes' || filters.module === 'agriculture-services') {
      lookups.push(
        searchModel(Scheme, dbQuery, filters.query, maxItemsPerCollection)
          .then(async (docs) => {
            const populated = await Scheme.populate(docs, { path: 'category', select: 'name slug' });
            return (populated as unknown as any[]).map(normalizeScheme);
          })
      );
    }
    
    // Job
    if (!filters.module || filters.module === 'jobs-exams' || filters.module === 'jobs') {
      lookups.push(searchModel(Job, dbQuery, filters.query, maxItemsPerCollection).then(docs => docs.map(normalizeJob)));
    }
    
    // Internship
    if (!filters.module || filters.module === 'internships') {
      lookups.push(searchModel(Internship, dbQuery, filters.query, maxItemsPerCollection).then(docs => docs.map(normalizeInternship)));
    }
    
    // Scholarship
    if (!filters.module || filters.module === 'scholarships') {
      lookups.push(searchModel(Scholarship, dbQuery, filters.query, maxItemsPerCollection).then(docs => docs.map(normalizeScholarship)));
    }
    
    // GovDocument
    if (!filters.module || filters.module === 'documents-certificates' || filters.module === 'documents') {
      lookups.push(searchModel(GovDocument, dbQuery, filters.query, maxItemsPerCollection).then(docs => docs.map(normalizeDocument)));
    }
    
    // GovernmentPortal
    if (!filters.module || filters.module === 'government-portals' || filters.module === 'portals') {
      lookups.push(searchModel(GovernmentPortal, dbQuery, filters.query, maxItemsPerCollection).then(docs => docs.map(normalizeGovernmentPortal)));
    }
    
    // Service
    if (!filters.module || filters.module === 'government-services' || filters.module === 'services') {
      lookups.push(
        searchModel(Service, dbQuery, filters.query, maxItemsPerCollection)
          .then(async (docs) => {
            const populated = await Service.populate(docs, { path: 'categoryId', select: 'name slug' });
            return (populated as unknown as any[]).map(normalizeService);
          })
      );
    }

    const resultsArray = await Promise.all(lookups);
    let allResources = resultsArray.flat();

    // Deduplication step based on a normalized name representation to avoid identical resources
    const uniqueResourcesMap = new Map<string, GovernmentResource>();
    for (const r of allResources) {
      const canonicalName = r.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!uniqueResourcesMap.has(canonicalName)) {
        uniqueResourcesMap.set(canonicalName, r);
      }
    }
    allResources = Array.from(uniqueResourcesMap.values());

    const query = filters.query || '';
    const normalizedTokens = normalizeQuery(query);
    const { intent, domain } = deriveIntent(normalizedTokens);

    const scoreCandidate = (resource: GovernmentResource): number => {
      let score = 0;
      
      const queryLower = query.toLowerCase();
      const nameLower = resource.name.toLowerCase();
      const descLower = (resource.description || '').toLowerCase();
      const eligibilityStr = JSON.stringify(resource.eligibility || {}).toLowerCase();
      const benefitsStr = (resource.benefits || []).join(' ').toLowerCase();
      const metaStr = JSON.stringify(resource.searchMetadata || {}).toLowerCase();
      const modLower = resource.module.toLowerCase();
      
      if (queryLower && normalizedTokens.length > 0) {
        if (nameLower === queryLower) score += 100;
        
        const fullNormalizedMatch = normalizedTokens.join(' ');
        if (nameLower.includes(fullNormalizedMatch)) score += 60;
        
        for (const term of normalizedTokens) {
          if (nameLower.includes(term)) score += 30;
          if (descLower.includes(term)) score += 10;
          if (eligibilityStr.includes(term)) score += 8;
          if (benefitsStr.includes(term)) score += 8;
          if (metaStr.includes(term)) score += 8;
        }

        if (intent) {
          if (resource.resourceType.toLowerCase() === intent || modLower.includes(intent)) score += 40;
          else if (intent === 'schemes' && resource.resourceType === 'Scheme') score += 40;
          else if (intent === 'jobs' && resource.resourceType === 'Job') score += 40;
          else if (intent === 'scholarships' && resource.resourceType === 'Scholarship') score += 40;
          else if (intent === 'internships' && resource.resourceType === 'Internship') score += 40;
          else if (intent === 'documents' && resource.resourceType === 'Document') score += 40;
          else if (intent === 'portals' && resource.resourceType === 'Portal') score += 40;
          else if (intent === 'services' && resource.resourceType === 'Service') score += 40;
        }

        if (domain) {
          if (nameLower.includes(domain) || descLower.includes(domain) || modLower.includes(domain)) {
            score += 25;
          } else {
            score -= 15;
          }
        }
      }

      if (filters.state && resource.location.state && resource.location.state.toLowerCase() === filters.state.toLowerCase()) {
        score += 20;
      }

      return score;
    };

    if (query) {
      const scoredResources = allResources.map(r => ({ resource: r, score: scoreCandidate(r) }));
      // Always sort by score first if query exists
      scoredResources.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.resource.name.localeCompare(b.resource.name);
      });
      allResources = scoredResources.map(s => s.resource);
    } else {
      // If no query, apply sorting filters
      if (filters.sort === 'recent') {
        allResources.sort((a, b) => {
          const tA = a.verification?.lastVerified ? new Date(a.verification.lastVerified).getTime() : 0;
          const tB = b.verification?.lastVerified ? new Date(b.verification.lastVerified).getTime() : 0;
          return tB - tA;
        });
      } else if (filters.sort === 'z-a') {
        allResources.sort((a, b) => b.name.localeCompare(a.name));
      } else {
        // Default to a-z
        allResources.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    if (filters.module) {
      const modQuery = filters.module.toLowerCase().replace(/-/g, ' ');
      if (modQuery !== 'services' && modQuery !== 'government services' && modQuery !== 'agriculture services') {
        allResources = allResources.filter(r => r.module.toLowerCase() === modQuery || r.module.toLowerCase().includes(modQuery));
      }
    }

    const total = allResources.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    
    const paginatedData = allResources.slice(offset, offset + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    };
  },

  /**
   * Retrieves a bounded global candidate pool specifically for the recommendation engine.
   * Does NOT use public API pagination semantics.
   */
  async getRecommendationCandidates(
    filters: SearchFilters = {},
    globalLimit: number = 40
  ): Promise<GovernmentResource[]> {
    const dbQuery: any = {};
    if (filters.status) dbQuery.status = filters.status;
    if (filters.state) {
      dbQuery.$or = [
        { state: { $regex: new RegExp(`^${filters.state}$`, 'i') } },
        { stateOrCentral: 'Central' },
        { level: 'Central' }
      ];
    }

    const limitPerCollection = Math.ceil(globalLimit / 2); 
    
    const lookups = [];

    lookups.push(
      searchModel(Scheme, dbQuery, filters.query, limitPerCollection).then(async (docs) => {
        const populated = await Scheme.populate(docs, { path: 'category', select: 'name slug' });
        return (populated as unknown as any[]).map(normalizeScheme);
      })
    );
    
    lookups.push(searchModel(Job, dbQuery, filters.query, limitPerCollection).then(docs => docs.map(normalizeJob)));
    lookups.push(searchModel(Internship, dbQuery, filters.query, limitPerCollection).then(docs => docs.map(normalizeInternship)));
    lookups.push(searchModel(Scholarship, dbQuery, filters.query, limitPerCollection).then(docs => docs.map(normalizeScholarship)));
    lookups.push(searchModel(GovDocument, dbQuery, filters.query, limitPerCollection).then(docs => docs.map(normalizeDocument)));
    lookups.push(searchModel(GovernmentPortal, dbQuery, filters.query, limitPerCollection).then(docs => docs.map(normalizeGovernmentPortal)));
    
    lookups.push(
      searchModel(Service, dbQuery, filters.query, limitPerCollection).then(async (docs) => {
        const populated = await Service.populate(docs, { path: 'categoryId', select: 'name slug' });
        return (populated as unknown as any[]).map(normalizeService);
      })
    );

    const resultsArray = await Promise.all(lookups);
    const allResources = resultsArray.flat();

    const query = filters.query || '';
    
    const scoreCandidate = (resource: GovernmentResource): number => {
      let score = 0;
      
      const queryLower = query.toLowerCase();
      const nameLower = resource.name.toLowerCase();
      const descLower = (resource.description || '').toLowerCase();
      
      if (queryLower) {
        if (nameLower === queryLower) score += 100;
        else if (nameLower.includes(queryLower)) score += 50;
        
        if (descLower.includes(queryLower)) score += 20;

        const terms = queryLower.split(/\s+/).filter(t => t.length > 2);
        for (const term of terms) {
          if (nameLower.includes(term)) score += 10;
          if (descLower.includes(term)) score += 5;
        }

        if (resource.resourceType === 'Job' && (queryLower.includes('job') || queryLower.includes('exam') || queryLower.includes('recruitment'))) score += 40;
        if (resource.resourceType === 'Scheme' && (queryLower.includes('scheme') || queryLower.includes('yojana') || queryLower.includes('agriculture'))) score += 40;
        if (resource.resourceType === 'Scholarship' && (queryLower.includes('scholarship') || queryLower.includes('student') || queryLower.includes('study'))) score += 40;
        if (resource.resourceType === 'Internship' && (queryLower.includes('intern') || queryLower.includes('training'))) score += 40;
      }

      if (filters.state && resource.location.state && resource.location.state.toLowerCase() === filters.state.toLowerCase()) {
        score += 30;
      }

      if (resource.resourceType === 'Portal' || resource.resourceType === 'Document') score -= 15;
      if (resource.resourceType === 'Service') score -= 5;

      return score;
    };

    allResources.sort((a, b) => {
      const scoreA = scoreCandidate(a);
      const scoreB = scoreCandidate(b);
      if (scoreB !== scoreA) {
        return scoreB - scoreA; 
      }
      return a.name.localeCompare(b.name);
    });

    return allResources.slice(0, globalLimit);
  },

  async getResourceBySlug(slug: string): Promise<GovernmentResource | null> {
    const lookups = [
      Scheme.findOne({ slug }).populate('category', 'name slug').lean().then(doc => doc ? normalizeScheme(doc) : null),
      Job.findOne({ slug }).lean().then(doc => doc ? normalizeJob(doc) : null),
      Internship.findOne({ slug }).lean().then(doc => doc ? normalizeInternship(doc) : null),
      Scholarship.findOne({ slug }).lean().then(doc => doc ? normalizeScholarship(doc) : null),
      GovDocument.findOne({ slug }).lean().then(doc => doc ? normalizeDocument(doc) : null),
      GovernmentPortal.findOne({ slug }).lean().then(doc => doc ? normalizeGovernmentPortal(doc) : null),
      Service.findOne({ slug }).populate('categoryId', 'name slug').lean().then(doc => doc ? normalizeService(doc) : null),
    ];

    const results = await Promise.all(lookups);
    return results.find(r => r !== null) || null;
  },
  
  async getResourceById(id: string): Promise<GovernmentResource | null> {
    const lookups = [
      Scheme.findById(id).populate('category', 'name slug').lean().then(doc => doc ? normalizeScheme(doc) : null),
      Job.findById(id).lean().then(doc => doc ? normalizeJob(doc) : null),
      Internship.findById(id).lean().then(doc => doc ? normalizeInternship(doc) : null),
      Scholarship.findById(id).lean().then(doc => doc ? normalizeScholarship(doc) : null),
      GovDocument.findById(id).lean().then(doc => doc ? normalizeDocument(doc) : null),
      GovernmentPortal.findById(id).lean().then(doc => doc ? normalizeGovernmentPortal(doc) : null),
      Service.findById(id).populate('categoryId', 'name slug').lean().then(doc => doc ? normalizeService(doc) : null),
    ];

    const results = await Promise.all(lookups);
    return results.find(r => r !== null) || null;
  },

  async getRelatedResources(resource: GovernmentResource, limit: number = 3): Promise<GovernmentResource[]> {
    // Basic heuristics: same module, same state, exclude the resource itself
    const filters: SearchFilters = {
      module: resource.module,
      state: resource.location.state,
    };
    
    // We can fetch a bit more and then filter/score to get top related
    const candidates = await this.getRecommendationCandidates(filters, 20);
    
    return candidates
      .filter(r => r.id !== resource.id)
      .slice(0, limit);
  }
};
