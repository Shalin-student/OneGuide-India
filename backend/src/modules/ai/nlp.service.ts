export interface ParsedQuery {
  originalQuery: string;
  normalizedQuery: string;
  intent: 'DISCOVER' | 'ELIGIBILITY' | 'APPLICATION' | 'DOCUMENTS_REQUIRED' | 'BENEFITS' | 'STATUS' | 'JOB_SEARCH' | 'SCHOLARSHIP_SEARCH' | 'GENERAL_GOVERNMENT_QUERY';
  module: string | null;
  entities: Record<string, string>;
  constraints: Record<string, string>;
  language: 'English' | 'Hindi' | 'Gujarati';
  searchTerms: string;
}

const STOP_WORDS = new Set(['what', 'which', 'how', 'can', 'are', 'is', 'the', 'for', 'me', 'available', 'to', 'in', 'of', 'a', 'an', 'government', 'i', 'do']);

const SYNONYM_MAP: Record<string, string> = {
  yojana: 'scheme',
  kisan: 'agriculture',
  farmer: 'agriculture',
  farming: 'agriculture',
  agri: 'agriculture',
  employment: 'jobs',
  exam: 'jobs',
  recruitment: 'jobs',
  'financial aid': 'scholarships',
  'student scholarship': 'scholarships',
  aadhar: 'aadhaar',
  uidai: 'aadhaar',
  certificate: 'documents',
  website: 'portals'
};

const detectLanguage = (query: string): 'English' | 'Hindi' | 'Gujarati' => {
  // Simple heuristic. A real implementation would use a language detection library.
  if (/[\u0900-\u097F]/.test(query)) return 'Hindi';
  if (/[\u0A80-\u0AFF]/.test(query)) return 'Gujarati';
  return 'English';
};

const extractIntentAndModule = (query: string, tokens: string[]): { intent: ParsedQuery['intent'], module: string | null } => {
  const q = query.toLowerCase();
  
  let intent: ParsedQuery['intent'] = 'DISCOVER';
  let module: string | null = null;

  // Module matching
  if (tokens.includes('scholarship') || tokens.includes('scholarships')) module = 'scholarships';
  else if (tokens.includes('job') || tokens.includes('jobs') || tokens.includes('exam')) module = 'jobs';
  else if (tokens.includes('internship') || tokens.includes('internships')) module = 'internships';
  else if (tokens.includes('scheme') || tokens.includes('schemes')) module = 'schemes';
  else if (tokens.includes('document') || tokens.includes('aadhaar') || tokens.includes('pan')) module = 'documents';
  else if (tokens.includes('agriculture') || tokens.includes('farmer')) {
    module = 'schemes'; 
  }

  // Intent matching
  if (q.includes('am i eligible') || q.includes('who can apply') || q.includes('eligibility')) {
    intent = 'ELIGIBILITY';
  } else if (q.includes('how to apply') || q.includes('application process') || q.includes('apply for')) {
    intent = 'APPLICATION';
  } else if (q.includes('documents required') || q.includes('what documents')) {
    intent = 'DOCUMENTS_REQUIRED';
  } else if (q.includes('what are the benefits') || q.includes('subsidy') || q.includes('amount')) {
    intent = 'BENEFITS';
  } else if (q.includes('status') || q.includes('track')) {
    intent = 'STATUS';
  } else if (module === 'jobs') {
    intent = 'JOB_SEARCH';
  } else if (module === 'scholarships') {
    intent = 'SCHOLARSHIP_SEARCH';
  }

  return { intent, module };
};

export const nlpService = {
  parseQuery: (rawQuery: string): ParsedQuery => {
    const language = detectLanguage(rawQuery);
    
    // Normalize
    const lower = rawQuery.toLowerCase().replace(/[^\w\s]/g, ' ');
    let tokens = lower.split(/\s+/).filter(t => t.length > 0 && !STOP_WORDS.has(t));
    
    // Synonyms
    tokens = tokens.map(t => SYNONYM_MAP[t] || t);
    const normalizedQuery = tokens.join(' ');
    
    const { intent, module } = extractIntentAndModule(rawQuery, tokens);

    // Simple entity/constraint extraction (mocked for deterministic speed, in reality uses NER)
    const entities: Record<string, string> = {};
    const constraints: Record<string, string> = {};

    // Remove intent-words from search terms to improve retrieval precision
    const intentWords = ['apply', 'eligible', 'eligibility', 'documents', 'how', 'what', 'who'];
    const searchTokens = tokens.filter(t => !intentWords.includes(t));

    return {
      originalQuery: rawQuery,
      normalizedQuery,
      intent,
      module,
      entities,
      constraints,
      language,
      searchTerms: searchTokens.join(' ')
    };
  }
};
