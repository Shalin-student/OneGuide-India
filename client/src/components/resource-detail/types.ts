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
    deadline?: string; // Date string
    fees?: string;
    processingTime?: string;
    applicationMode?: string;
  };
  officialSources: { sourceName: string; sourceURL: string; sourceType?: string }[];
  verification: {
    status: string;
    lastVerified?: string;
  };
  searchMetadata?: Record<string, any>;
  relatedResources?: GovernmentResource[];
}
