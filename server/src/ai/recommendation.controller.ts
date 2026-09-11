import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import dotenv from 'dotenv';
import path from 'path';
import { resourceRetrievalService } from '../services/resourceRetrieval.service';
import { mapToLegacyContract } from '../modules/services/service.controller';
import { GovernmentResource } from '../services/resourceNormalization.service';
import { aiGateway } from '../services/ai.gateway';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const evaluateEligibility = (c: GovernmentResource, u: any): 'ELIGIBLE' | 'INELIGIBLE' | 'UNKNOWN' => {
  let hasUnknowns = false;
  let hasEligible = false;

  // 1. STATE
  if (c.location.level === 'State' && c.location.state) {
    if (u.state) {
      if (c.location.state.toLowerCase() !== u.state.toLowerCase()) {
        return 'INELIGIBLE';
      }
      hasEligible = true;
    } else {
      hasUnknowns = true;
    }
  }

  // 2. AGE
  if (c.eligibility.age && typeof c.eligibility.age === 'object') {
    if (u.age) {
      if ((c.eligibility.age.min && u.age < c.eligibility.age.min) ||
          (c.eligibility.age.max && u.age > c.eligibility.age.max)) {
        return 'INELIGIBLE';
      }
      hasEligible = true;
    } else {
      hasUnknowns = true;
    }
  } else if (c.eligibility.age && typeof c.eligibility.age === 'string') {
    hasUnknowns = true; // Unparseable age strings
  }

  // 3. TARGET AUDIENCE (Gender, Category, Disability, Student)
  if (c.eligibility.targetAudience && c.eligibility.targetAudience.length > 0) {
    const aud = c.eligibility.targetAudience.map(a => a.toLowerCase());
    
    // Gender restriction
    const resourceGenders = aud.filter(a => ['male', 'female', 'transgender', 'other'].includes(a));
    if (resourceGenders.length > 0) {
      if (u.gender) {
        if (!resourceGenders.includes(u.gender.toLowerCase())) {
          return 'INELIGIBLE';
        }
        hasEligible = true;
      } else {
        hasUnknowns = true;
      }
    }

    // Social Category restriction
    const validCategories = ['general', 'obc', 'sc', 'st', 'minority'];
    const resourceCategories = aud.filter(a => validCategories.includes(a));
    if (resourceCategories.length > 0) {
      if (u.socialCategory) {
        if (!resourceCategories.includes(u.socialCategory.toLowerCase())) {
          return 'INELIGIBLE';
        }
        hasEligible = true;
      } else {
        hasUnknowns = true;
      }
    }

    // Student restriction
    if (aud.includes('student')) {
      const emp = u.employmentStatus?.toLowerCase() || '';
      if (emp && emp !== 'student' && !emp.includes('intern')) {
        return 'INELIGIBLE';
      }
      if (emp === 'student') hasEligible = true;
      if (!emp) hasUnknowns = true;
    }

    // Disability restriction
    if (aud.includes('disabled') || aud.includes('pwd')) {
      const dis = u.disabilityStatus?.toLowerCase() || '';
      if (dis === 'no' || dis === 'none') {
        return 'INELIGIBLE';
      }
      if (dis && dis !== 'none') hasEligible = true;
      if (!dis) hasUnknowns = true;
    }
  }

  // 4. INCOME
  if (c.eligibility.incomeLimit) {
    hasUnknowns = true; // Cannot deterministically parse random string income limits
  }

  if (hasUnknowns) return 'UNKNOWN';
  if (hasEligible) return 'ELIGIBLE';
  return 'UNKNOWN';
};

const calculateRelevanceScore = (c: GovernmentResource, u: any, eligibilityStatus: string): number => {
  let score = 0;

  // Exact State Match
  if (c.location.level === 'State' && c.location.state && u.state) {
    if (c.location.state.toLowerCase() === u.state.toLowerCase()) {
      score += 20;
    }
  } else if (c.location.level === 'Central') {
    score += 5; // Central schemes apply to all
  }

  // Explicit User Interests Match
  const uInterests = (u.userInterests || []).map((i: string) => i.toLowerCase());
  const rCategory = c.module?.toLowerCase() || '';
  const rDesc = (c.description || '').toLowerCase();
  
  if (uInterests.includes(rCategory)) {
    score += 15;
  }
  for (const interest of uInterests) {
    if (rDesc.includes(interest)) score += 5;
    if (c.name.toLowerCase().includes(interest)) score += 10;
  }

  // Eligibility Bonus
  if (eligibilityStatus === 'ELIGIBLE') {
    score += 20;
  } else if (eligibilityStatus === 'UNKNOWN') {
    score += 5;
  }

  // Penalty for Generic Portals unless explicitly searched
  if (c.resourceType === 'Portal') {
    score -= 10;
  }

  return score;
};

const generateDeterministicReason = (c: GovernmentResource, u: any): string => {
  const lang = u.preferredLanguage || 'en';
  
  if (lang === 'hi') {
    const reasons = [];
    if (c.location.level === 'State' && c.location.state && u.state && c.location.state.toLowerCase() === u.state.toLowerCase()) {
      reasons.push(`आपके राज्य (${c.location.state}) से मेल खाता है`);
    }
    const uInterests = (u.userInterests || []).map((i: string) => i.toLowerCase());
    const rCategory = c.module?.toLowerCase() || '';
    if (uInterests.includes(rCategory)) {
      reasons.push(`${c.module} में आपकी रुचि के अनुरूप है`);
    }
    if (c.resourceType === 'Scholarship' && u.employmentStatus === 'student') {
      reasons.push('छात्रों के लिए प्रासंगिक है');
    }
    if (reasons.length > 0) {
      return `अनुशंसित क्योंकि यह संसाधन ${reasons.join(' और ')}।`;
    }
    return 'आपकी सामान्य प्रोफ़ाइल के आधार पर अनुशंसित।';
  }
  
  if (lang === 'gu') {
    const reasons = [];
    if (c.location.level === 'State' && c.location.state && u.state && c.location.state.toLowerCase() === u.state.toLowerCase()) {
      reasons.push(`તમારા રાજ્ય (${c.location.state}) સાથે મેળ ખાય છે`);
    }
    const uInterests = (u.userInterests || []).map((i: string) => i.toLowerCase());
    const rCategory = c.module?.toLowerCase() || '';
    if (uInterests.includes(rCategory)) {
      reasons.push(`${c.module} માં તમારી રુચિ સાથે સુસંગત છે`);
    }
    if (c.resourceType === 'Scholarship' && u.employmentStatus === 'student') {
      reasons.push('વિદ્યાર્થીઓ માટે સુસંગત છે');
    }
    if (reasons.length > 0) {
      return `ભલામણ કરેલ કારણ કે આ સંસાધન ${reasons.join(' અને ')}.`;
    }
    return 'તમારી સામાન્ય પ્રોફાઇલના આધારે ભલામણ કરેલ.';
  }

  const reasons = [];
  
  if (c.location.level === 'State' && c.location.state && u.state && c.location.state.toLowerCase() === u.state.toLowerCase()) {
    reasons.push(`matches your state (${c.location.state})`);
  }
  
  const uInterests = (u.userInterests || []).map((i: string) => i.toLowerCase());
  const rCategory = c.module?.toLowerCase() || '';
  if (uInterests.includes(rCategory)) {
    reasons.push(`aligns with your interest in ${c.module}`);
  }

  if (c.resourceType === 'Scholarship' && u.employmentStatus === 'student') {
    reasons.push('relevant for students');
  }

  if (reasons.length > 0) {
    return `Recommended because this resource ${reasons.join(' and ')}.`;
  }
  return 'Recommended based on your general profile attributes.';
};

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Not authorized' });
      return;
    }

    const u = req.user;
    
    // 1. CANDIDATE RETRIEVAL
    const goalQuery = [
      ...(u.specificGoals || []),
      u.fieldOfWork || '',
      ...(u.userInterests || [])
    ].filter(Boolean).join(' ');
    
    let candidatePool: GovernmentResource[] = [];

    // Search bounded dynamically across collections, returning exactly up to 40 items
    candidatePool = await resourceRetrievalService.getRecommendationCandidates(
      { query: goalQuery, state: u.state },
      40 
    );

    if (candidatePool.length === 0) {
      candidatePool = await resourceRetrievalService.getRecommendationCandidates(
        { state: u.state },
        20
      );
    }

    // 2. ELIGIBILITY FILTERING
    const candidatesWithStatus = candidatePool.map(c => {
      const status = evaluateEligibility(c, u);
      return { ...c, eligibilityStatus: status };
    });

    const eligibleCandidates = candidatesWithStatus.filter(c => c.eligibilityStatus !== 'INELIGIBLE');

    if (eligibleCandidates.length === 0) {
      res.status(200).json({ status: 'success', data: [], mode: 'deterministic' });
      return;
    }

    // 3. DETERMINISTIC RELEVANCE SCORING
    const scoredCandidates = eligibleCandidates.map(c => {
      const score = calculateRelevanceScore(c, u, c.eligibilityStatus);
      return { ...c, relevanceScore: score };
    });

    // 4. DUPLICATE & LOW-VALUE FILTERING
    // Sort by relevance score descending
    scoredCandidates.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Deduplicate by normalized name
    const uniqueCandidatesMap = new Map<string, any>();
    for (const c of scoredCandidates) {
      const canonicalName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!uniqueCandidatesMap.has(canonicalName)) {
        uniqueCandidatesMap.set(canonicalName, c);
      }
    }
    
    const uniqueCandidates = Array.from(uniqueCandidatesMap.values());
    const top12 = uniqueCandidates.slice(0, 12);

    // 5. AI RANKING & EXPLANATION (WITH FALLBACK)
    let finalRecommendations: any[] = [];
    let mode = 'deterministic';

    const candidateData = top12.map(c => ({
      id: c.id,
      title: c.name,
      type: c.resourceType,
      module: c.module,
      eligibility: c.eligibility.overview || '',
      benefits: c.benefits?.join(', ') || '',
      eligibilityStatus: c.eligibilityStatus
    }));

    try {
      const prompt = `You are the OneGuide Recommendation Engine.
USER PROFILE:
- Age: ${u.age || 'Unknown'}
- State: ${u.state || 'Unknown'}
- Education: ${u.educationLevel || 'Unknown'}
- Employment: ${u.employmentStatus || 'Unknown'}
- Field: ${u.fieldOfWork || 'Unknown'}
- Income: ${u.annualIncomeRange || 'Unknown'}
- Category: ${u.socialCategory || 'Unknown'}
- Gender: ${u.gender || 'Unknown'}
- Disability: ${u.disabilityStatus || 'Unknown'}
- Goals: ${u.specificGoals?.join(', ') || 'Unknown'}
- Interests: ${u.userInterests?.join(', ') || 'Unknown'}
- Preferred Language: ${u.preferredLanguage || 'English'}

CANDIDATES (JSON Array):
${JSON.stringify(candidateData)}

TASK:
Analyze the candidates and select UP TO 6 most relevant items for this user based on interests, goals, and profile matching.
Return a valid JSON array of objects (1 to 6 items). Do not pad with irrelevant items.
Each object must have:
- "id": The candidate id
- "matchReason": A short, 1-sentence personalized explanation of why this is recommended for them. 
CRITICAL: The matchReason MUST be written in the user's Preferred Language. If the preferred language is Hindi ('hi'), write the reason in Hindi. If Gujarati ('gu'), write in Gujarati. Otherwise, write in English.`;

      const systemInstruction = `You are the OneGuide Recommendation Engine. Ensure your response is a valid JSON array of objects.`;
      
      const aiResponseText = await aiGateway.generateJson(prompt, { systemInstruction });

      let cleanedText = aiResponseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json/g, '').replace(/```/g, '');
      }

      const rankedIds: { id: string, matchReason: string }[] = JSON.parse(cleanedText.trim());

      finalRecommendations = rankedIds.map(rank => {
        const fullDoc = top12.find(c => c.id === rank.id);
        return fullDoc ? { ...mapToLegacyContract(fullDoc), matchReason: rank.matchReason } : null;
      }).filter(doc => doc !== null);
      
      if (finalRecommendations.length > 0) {
        mode = 'ai_ranked';
      } else {
        throw new Error('AI returned empty array');
      }

    } catch (e) {
      console.warn('AI Ranking Failed, falling back to deterministic ranking.', e);
      // Fallback
      mode = 'deterministic';
      const top6 = top12.slice(0, 6);
      finalRecommendations = top6.map(c => {
        return { 
          ...mapToLegacyContract(c), 
          matchReason: generateDeterministicReason(c, u) 
        };
      });
    }

    res.status(200).json({
      status: 'success',
      mode,
      data: finalRecommendations
    });

  } catch (error) {
    console.error('Recommendation Engine Error:', error);
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
