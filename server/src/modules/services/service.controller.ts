import { Request, Response } from 'express';
import { Service } from '../services/service.model';
import { Scheme } from '../schemes/scheme.model';
import { Job } from '../jobs/job.model';
import { Internship } from '../internships/internship.model';
import { Scholarship } from '../scholarships/scholarship.model';
import { GovDocument } from '../documents/document.model';
import { GovernmentPortal } from '../government-portals/governmentPortal.model';
import { AuthRequest } from '../../middleware/auth.middleware';

type DiscoveryRecord = Record<string, any>;

const CATEGORY_NAMES = {
  scheme: 'Government Schemes',
  job: 'Jobs & Exams',
  internship: 'Internships',
  scholarship: 'Scholarships',
  document: 'Documents & Certificates',
  portal: 'Government Portals',
} as const;

const normalizeRecord = (record: DiscoveryRecord, source: keyof typeof CATEGORY_NAMES) => {
  const categoryName = source === 'scheme' && record.category?.name
    ? record.category.name
    : CATEGORY_NAMES[source];
  const name = record.name || record.title;
  const description = record.description || record.shortDescription || `${name} information`;
  const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
  const benefits = Array.isArray(record.benefits)
    ? record.benefits
    : record.benefits
      ? [record.benefits]
      : undefined;

  return {
    ...record,
    _id: String(record._id),
    name,
    description,
    slug: record.slug,
    categoryId: { name: categoryName, slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
    governmentDepartment: record.governmentDepartment || record.department || record.ministry ||
      record.organization || record.provider || record.issuingAuthority,
    state: record.state,
    stateOrCentral: record.level === 'State' || (record.state && record.state !== 'All India')
      ? 'State'
      : 'Central',
    eligibility: (record.eligibility && typeof record.eligibility === 'object' && Array.isArray(record.eligibility.criteria))
      ? record.eligibility.criteria
      : record.eligibility?.overview || record.eligibility,
    documentsRequired: record.documentsRequired || 
      (Array.isArray(record.requiredDocuments) ? record.requiredDocuments.map((d: any) => typeof d === 'object' ? d.name : d) : record.requiredDocuments),
    applicationProcess: (record.applicationProcess && typeof record.applicationProcess === 'object' && Array.isArray(record.applicationProcess.steps))
      ? record.applicationProcess.steps.map((s: any) => `${s.step}. ${s.title}: ${s.description}`)
      : record.applicationProcess,
    faqs: record.faqs || record.faq,
    benefits,
    sourceUrl,
    sourceType: source,
  };
};

const getDiscoveryRecords = async () => {
  const [schemes, jobs, internships, scholarships, documents, portals] = await Promise.all([
    Scheme.find({}).populate('category', 'name slug').lean(),
    Job.find({}).lean(),
    Internship.find({}).lean(),
    Scholarship.find({}).lean(),
    GovDocument.find({}).lean(),
    GovernmentPortal.find({}).lean(),
  ]);

  return [
    ...schemes.map(record => normalizeRecord(record, 'scheme')),
    ...jobs.map(record => normalizeRecord(record, 'job')),
    ...internships.map(record => normalizeRecord(record, 'internship')),
    ...scholarships.map(record => normalizeRecord(record, 'scholarship')),
    ...documents.map(record => normalizeRecord(record, 'document')),
    ...portals.map(record => normalizeRecord(record, 'portal')),
  ];
};

export const getDiscoveryRecordById = async (id: string) => {
  const lookups = [
    Scheme.findById(id).populate('category', 'name slug').lean().then(record => record && normalizeRecord(record, 'scheme')),
    Job.findById(id).lean().then(record => record && normalizeRecord(record, 'job')),
    Internship.findById(id).lean().then(record => record && normalizeRecord(record, 'internship')),
    Scholarship.findById(id).lean().then(record => record && normalizeRecord(record, 'scholarship')),
    GovDocument.findById(id).lean().then(record => record && normalizeRecord(record, 'document')),
    GovernmentPortal.findById(id).lean().then(record => record && normalizeRecord(record, 'portal')),
  ];

  return (await Promise.all(lookups)).find(Boolean);
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, state, search } = req.query;
    const categoryQuery = String(category || '').toLowerCase().replace(/-/g, ' ');
    const searchQuery = String(search || '').trim().toLowerCase();
    const services = await getDiscoveryRecords();

    const filteredServices = services.filter(service => {
      const matchesCategory = !categoryQuery ||
        service.categoryId.name.toLowerCase() === categoryQuery ||
        service.categoryId.slug === String(category || '').toLowerCase();
      const matchesState = !state ||
        service.stateOrCentral.toLowerCase() === String(state).toLowerCase() ||
        String(service.state || '').toLowerCase().includes(String(state).toLowerCase());
      const searchableText = JSON.stringify(service).toLowerCase();
      const matchesSearch = !searchQuery || searchableText.includes(searchQuery);

      return matchesCategory && matchesState && matchesSearch;
    });

    res.json({ status: 'success', data: filteredServices });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await getDiscoveryRecordById(String(req.params.id));
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });
    res.json({ status: 'success', data: service });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const lookups = [
      Scheme.findOne({ slug: req.params.slug }).populate('category', 'name slug').lean().then(record => record && normalizeRecord(record, 'scheme')),
      Job.findOne({ slug: req.params.slug }).lean().then(record => record && normalizeRecord(record, 'job')),
      Internship.findOne({ slug: req.params.slug }).lean().then(record => record && normalizeRecord(record, 'internship')),
      Scholarship.findOne({ slug: req.params.slug }).lean().then(record => record && normalizeRecord(record, 'scholarship')),
      GovDocument.findOne({ slug: req.params.slug }).lean().then(record => record && normalizeRecord(record, 'document')),
      GovernmentPortal.findOne({ slug: req.params.slug }).lean().then(record => record && normalizeRecord(record, 'portal')),
    ];
    const service = (await Promise.all(lookups)).find(Boolean);
    if (!service) return res.status(404).json({ status: 'error', message: 'Service not found' });
    res.json({ status: 'success', data: service });
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
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    // Basic recommendation scoring based on user profile or questionnaire answers
    const { age, state, occupation, category, disability, isStudent, bpl } = req.body;
    
    // Fetch all active services
    const services = await Service.find({ status: 'Active' }).populate('categoryId', 'name slug');
    
    // Score each service
    const scoredServices = services.map(service => {
      let score = 0;
      
      // State match
      if (service.stateOrCentral === 'Central') score += 10;
      else if (service.state && state && service.state.toLowerCase() === state.toLowerCase()) score += 20;

      // Occupation / Audience match
      if (occupation && service.eligibility.occupations && service.eligibility.occupations.includes(occupation)) score += 20;

      // Student match
      if (isStudent && service.eligibility.studentRequired) score += 20;

      // Social Category match
      if (category && service.eligibility.socialCategories && service.eligibility.socialCategories.includes(category)) score += 15;

      // BPL match
      if (bpl && service.eligibility.bplRequired) score += 15;

      // Disability match
      if (disability && service.eligibility.disabilityRequired) score += 15;

      // Age range match
      if (age && service.eligibility.ageRange) {
        if ((!service.eligibility.ageRange.min || age >= service.eligibility.ageRange.min) && 
            (!service.eligibility.ageRange.max || age <= service.eligibility.ageRange.max)) {
          score += 10;
        }
      }

      return {
        service,
        score
      };
    });

    // Sort by score descending and filter out very low scores if necessary
    scoredServices.sort((a, b) => b.score - a.score);
    
    // Return top 10 recommendations
    const recommendations = scoredServices.slice(0, 10).map(s => s.service);

    res.json({ status: 'success', data: recommendations });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
