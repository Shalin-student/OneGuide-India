import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Scheme } from '../modules/schemes/scheme.model';
import { Job } from '../modules/jobs/job.model';
import { Scholarship } from '../modules/scholarships/scholarship.model';
import { Internship } from '../modules/internships/internship.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getRecommendations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.onboardingCompleted) {
      res.status(403).json({ status: 'error', message: 'User must complete onboarding first.' });
      return;
    }

    const u = req.user;
    let allCandidates: any[] = [];

    // Deterministic Pre-Filtering based on selected interests
    const interests = u.userInterests || [];
    
    // Convert goals to a query string for basic text search
    const goalQuery = u.specificGoals?.join(' ') || u.fieldOfWork || '';

    // Search Schemes
    if (interests.length === 0 || interests.includes('Government Schemes & Yojanas') || interests.includes('Agriculture Services')) {
      const schemes = await Scheme.find(goalQuery ? { $text: { $search: goalQuery } } : {}).limit(10).lean();
      allCandidates.push(...schemes.map(s => ({ ...s, type: 'Scheme' })));
    }

    // Search Jobs
    if (interests.length === 0 || interests.includes('Government Jobs & Exams')) {
      const jobs = await Job.find(goalQuery ? { $text: { $search: goalQuery } } : {}).limit(5).lean();
      allCandidates.push(...jobs.map(j => ({ ...j, type: 'Job' })));
    }

    // Search Scholarships
    if (interests.length === 0 || interests.includes('Scholarships')) {
      const scholarships = await Scholarship.find(goalQuery ? { $text: { $search: goalQuery } } : {}).limit(5).lean();
      allCandidates.push(...scholarships.map(s => ({ ...s, type: 'Scholarship' })));
    }

    // Search Internships
    if (interests.length === 0 || interests.includes('Internships')) {
      const internships = await Internship.find(goalQuery ? { $text: { $search: goalQuery } } : {}).limit(5).lean();
      allCandidates.push(...internships.map(i => ({ ...i, type: 'Internship' })));
    }

    // If no candidates found, fallback to most recent across all
    if (allCandidates.length === 0) {
      const schemes = await Scheme.find().sort({ createdAt: -1 }).limit(3).lean();
      const jobs = await Job.find().sort({ createdAt: -1 }).limit(3).lean();
      allCandidates = [
        ...schemes.map(s => ({ ...s, type: 'Scheme' })),
        ...jobs.map(j => ({ ...j, type: 'Job' }))
      ];
    }

    // NLP Relevance Scoring & Ranking via Gemini
    // We send the candidates to Gemini and ask it to rank the top 6 and provide a "matchReason"
    
    const candidateData = allCandidates.map(c => ({
      id: c._id,
      title: c.title || c.name,
      type: c.type,
      eligibility: c.eligibilityCriteria || c.eligibility || '',
    }));

    const prompt = `You are the OneGuide Recommendation Engine.
USER PROFILE:
- Age: ${u.age || 'Unknown'}
- State: ${u.state || 'Unknown'}
- Education: ${u.educationLevel || 'Unknown'}
- Employment: ${u.employmentStatus || 'Unknown'}
- Field: ${u.fieldOfWork || 'Unknown'}
- Income: ${u.annualIncomeRange || 'Unknown'}
- Goals: ${u.specificGoals?.join(', ') || 'Unknown'}

CANDIDATES (JSON Array):
${JSON.stringify(candidateData)}

TASK:
Analyze the candidates and select the top 6 most relevant items for this user.
Respond ONLY with a valid JSON array of objects.
Each object must have:
- "id": The candidate id
- "matchReason": A short, 1-sentence personalized explanation of why this is recommended for them (e.g. "Recommended because you are a student in Gujarat seeking scholarships.").`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    let aiResponseText = result.response.text();
    
    // Strip markdown formatting if Gemini added it
    if (aiResponseText.startsWith('\`\`\`json')) {
      aiResponseText = aiResponseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }

    let rankedIds: { id: string, matchReason: string }[] = [];
    try {
      rankedIds = JSON.parse(aiResponseText.trim());
    } catch (e) {
      console.error('Failed to parse Gemini recommendation JSON:', e);
      // Fallback
      rankedIds = candidateData.slice(0, 6).map(c => ({ id: c.id.toString(), matchReason: "Recommended based on your basic preferences." }));
    }

    // Map back to full documents
    const finalRecommendations = rankedIds.map(rank => {
      const fullDoc = allCandidates.find(c => c._id.toString() === rank.id.toString());
      return fullDoc ? { ...fullDoc, matchReason: rank.matchReason } : null;
    }).filter(doc => doc !== null);

    res.status(200).json({
      status: 'success',
      data: finalRecommendations
    });

  } catch (error) {
    console.error('Recommendation Engine Error:', error);
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
