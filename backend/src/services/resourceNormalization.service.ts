export interface GovernmentResource {
  id: string;
  resourceType: 'Scheme' | 'Job' | 'Internship' | 'Scholarship' | 'Service' | 'Document' | 'Portal';
  module: string;
  name: string;
  slug: string;
  description: string;
  authority?: string;
  location: {
    level: 'Central' | 'State' | 'Unknown';
    state?: string;
  };
  eligibility: {
    overview?: string;
    age?: { min?: number; max?: number } | string;
    incomeLimit?: string;
    targetAudience?: string[];
    qualification?: string;
    socialCategory?: string[];
    gender?: string[];
    occupation?: string[];
    student?: boolean;
    disability?: boolean;
    stateApplicability?: string;
  };
  benefits?: string[];
  documentsRequired?: string[];
  application: {
    processSteps?: { stepNumber: number; title: string; description: string }[] | string | string[];
    url?: string;
    deadline?: Date;
    fees?: string;
    processingTime?: string;
    applicationMode?: string;
  };
  officialSources: { sourceName: string; sourceURL: string; sourceType?: string }[];
  verification: {
    status: string;
    lastVerified?: Date;
  };
  searchMetadata?: Record<string, any>;
  relatedResources?: GovernmentResource[];
}

export const normalizeScheme = (record: any): GovernmentResource => {
  const moduleName = record.category?.name || 'Government Schemes';
  
  const benefits = Array.isArray(record.benefits) 
    ? record.benefits 
    : record.benefits 
      ? [record.benefits] 
      : [];

  return {
    id: String(record._id),
    resourceType: 'Scheme',
    module: moduleName,
    name: record.name || record.title,
    slug: record.slug,
    description: record.description || record.shortDescription || `${record.name} information`,
    authority: record.ministry || record.department,
    location: {
      level: record.level || (record.state && record.state !== 'All India' ? 'State' : 'Central'),
      state: record.state,
    },
    eligibility: {
      overview: record.eligibility,
      age: record.ageLimit,
      incomeLimit: record.incomeLimit,
      student: record.studentEligibility || false,
      disability: false, // Default unless specified
      targetAudience: [
        record.bplEligibility && 'BPL',
        record.governmentEmployeeEligibility && 'Government Employee',
      ].filter(Boolean) as string[],
    },
    benefits,
    documentsRequired: record.requiredDocuments || [],
    application: {
      processSteps: record.applicationProcess,
      url: record.applicationUrl,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Source',
        sourceURL: record.sourceUrl || record.officialWebsite || record.applicationUrl,
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    }
  };
};

export const normalizeJob = (record: any): GovernmentResource => {
  return {
    id: String(record._id),
    resourceType: 'Job',
    module: 'Jobs & Exams',
    name: record.title || record.name,
    slug: record.slug,
    description: record.description || `${record.title} details`,
    authority: record.organization || record.department,
    location: {
      level: record.state && record.state !== 'All India' ? 'State' : 'Central',
      state: record.state || record.location,
    },
    eligibility: {
      overview: [record.qualification, record.experience].filter(Boolean).join(' | '),
      age: record.ageLimit,
      qualification: record.qualification,
    },
    application: {
      processSteps: record.applicationProcedure,
      url: record.applicationUrl,
      deadline: record.applicationDeadline,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Notification',
        sourceURL: record.officialNotificationUrl || record.sourceUrl || record.officialWebsite,
        sourceType: 'Notification'
      },
      {
        sourceName: 'Application Portal',
        sourceURL: record.applicationUrl,
        sourceType: 'Application'
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    },
    searchMetadata: {
      salary: record.salary,
      vacancies: record.vacancies,
      jobType: record.jobType,
      selectionProcess: record.selectionProcess,
    }
  };
};

export const normalizeInternship = (record: any): GovernmentResource => {
  return {
    id: String(record._id),
    resourceType: 'Internship',
    module: 'Internships',
    name: record.title || record.name,
    slug: record.slug,
    description: record.description || `${record.title} details`,
    authority: record.organization || record.department,
    location: {
      level: record.state && record.state !== 'All India' ? 'State' : 'Central',
      state: record.state || record.location,
    },
    eligibility: {
      overview: record.eligibility || record.qualification,
      qualification: record.qualification,
    },
    application: {
      url: record.applicationUrl,
      deadline: record.applicationDeadline,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Source',
        sourceURL: record.sourceUrl || record.officialWebsite || record.applicationUrl,
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    },
    searchMetadata: {
      stipend: record.stipend,
      duration: record.duration,
      startDate: record.startDate,
    }
  };
};

export const normalizeScholarship = (record: any): GovernmentResource => {
  return {
    id: String(record._id),
    resourceType: 'Scholarship',
    module: 'Scholarships',
    name: record.name || record.title,
    slug: record.slug,
    description: record.description || `${record.name} details`,
    authority: record.provider || record.ministry,
    location: {
      level: record.level || (record.state && record.state !== 'All India' ? 'State' : 'Central'),
      state: record.state,
    },
    eligibility: {
      overview: record.eligibility || record.qualification,
      incomeLimit: record.incomeLimit,
      qualification: record.qualification,
      socialCategory: record.category ? [record.category] : [],
      student: true,
    },
    benefits: [record.benefits].filter(Boolean) as string[],
    documentsRequired: record.requiredDocuments || [],
    application: {
      url: record.applicationUrl,
      deadline: record.applicationDeadline,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Source',
        sourceURL: record.sourceUrl || record.officialWebsite || record.applicationUrl,
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    }
  };
};

export const normalizeDocument = (record: any): GovernmentResource => {
  return {
    id: String(record._id),
    resourceType: 'Document',
    module: 'Documents & Certificates',
    name: record.name || record.title,
    slug: record.slug,
    description: record.description || `${record.name} details`,
    authority: record.issuingAuthority,
    location: {
      level: 'Unknown',
    },
    eligibility: {
      overview: typeof record.eligibility === 'string' ? record.eligibility : JSON.stringify(record.eligibility),
    },
    documentsRequired: Array.isArray(record.requiredDocuments) 
      ? record.requiredDocuments.map((d: any) => typeof d === 'object' ? d.name || JSON.stringify(d) : String(d))
      : typeof record.requiredDocuments === 'string' ? [record.requiredDocuments] : [],
    application: {
      processSteps: typeof record.applicationProcess === 'string' ? record.applicationProcess : undefined,
      url: record.applicationUrl,
      applicationMode: record.applicationMode || (record.applicationUrl ? 'Online' : 'Offline'),
      fees: record.fees,
      processingTime: record.processingTime,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Source',
        sourceURL: record.sourceUrl || record.officialWebsite || record.applicationUrl,
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    }
  };
};

export const normalizeGovernmentPortal = (record: any): GovernmentResource => {
  return {
    id: String(record._id),
    resourceType: 'Portal',
    module: 'Government Portals',
    name: record.name || record.title,
    slug: record.slug,
    description: record.description || `${record.name} portal`,
    authority: record.ministry || record.department,
    location: {
      level: record.level || (record.state && record.state !== 'All India' ? 'State' : 'Central'),
      state: record.state,
    },
    eligibility: {},
    application: {
      url: record.websiteUrl,
    },
    officialSources: [
      {
        sourceName: record.sourceName || 'Official Portal',
        sourceURL: record.websiteUrl || record.sourceUrl || record.officialWebsite,
      }
    ].filter(s => s.sourceURL),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.lastVerified,
    },
    searchMetadata: {
      services: record.services,
    }
  };
};

export const normalizeService = (record: any): GovernmentResource => {
  const moduleName = record.categoryId?.name || 'Government Services';

  return {
    id: String(record._id),
    resourceType: 'Service',
    module: moduleName,
    name: record.name,
    slug: record.slug,
    description: record.description,
    authority: record.governmentDepartment,
    location: {
      level: record.stateOrCentral || 'Unknown',
      state: record.state,
    },
    eligibility: {
      overview: record.eligibility?.overview,
      age: record.eligibility?.ageRange,
      incomeLimit: record.eligibility?.incomeRange ? JSON.stringify(record.eligibility.incomeRange) : undefined,
      occupation: record.eligibility?.occupations,
      socialCategory: record.eligibility?.socialCategories,
      gender: record.eligibility?.genders,
      student: record.eligibility?.studentRequired,
      disability: record.eligibility?.disabilityRequired,
      targetAudience: [
        record.eligibility?.bplRequired ? 'BPL' : null,
      ].filter(Boolean) as string[],
    },
    benefits: record.benefits || [],
    documentsRequired: record.documentsRequired || [],
    application: {
      processSteps: record.procedure,
      fees: record.fees,
      processingTime: record.processingTime,
    },
    officialSources: (record.officialSources || []).map((s: any) => ({
      sourceName: s.sourceName,
      sourceURL: s.sourceURL,
      sourceType: s.sourceType,
    })),
    verification: {
      status: record.status || 'Active',
      lastVerified: record.officialSources?.[0]?.verifiedAt || record.updatedAt,
    },
    searchMetadata: {
      tags: record.tags,
    }
  };
};
