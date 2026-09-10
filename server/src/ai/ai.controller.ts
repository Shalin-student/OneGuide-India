import { Request, Response } from 'express';
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

import { Scheme } from '../modules/schemes/scheme.model';
import { Job } from '../modules/jobs/job.model';
import { Scholarship } from '../modules/scholarships/scholarship.model';
import { Internship } from '../modules/internships/internship.model';
import { Service } from '../modules/services/service.model';
import { GovDocument } from '../modules/documents/document.model';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper for mapping DB models
const searchDatabase = async (model: any, query: string) => {
  try {
    const results = await model.find({ $text: { $search: query } }).limit(5).lean();
    if (results && results.length > 0) return results;
  } catch (e) {
    // Fallback if no text index
  }
  
  const regex = new RegExp(query, 'i');
  const results = await model.find({
    $or: [
      { name: regex },
      { title: regex },
      { description: regex }
    ]
  }).limit(5).lean();
  return results;
};

// Function declarations for Gemini
const searchSchemesDeclaration: FunctionDeclaration = {
  name: 'search_schemes',
  description: 'Search for government schemes, yojanas, and agricultural assistance based on keywords.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: { query: { type: SchemaType.STRING, description: 'Search keywords' } },
    required: ['query'],
  },
};

const searchJobsDeclaration: FunctionDeclaration = {
  name: 'search_jobs',
  description: 'Search for government jobs, exams, and vacancies.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: { query: { type: SchemaType.STRING, description: 'Search keywords' } },
    required: ['query'],
  },
};

const searchScholarshipsDeclaration: FunctionDeclaration = {
  name: 'search_scholarships',
  description: 'Search for scholarships and educational grants.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: { query: { type: SchemaType.STRING, description: 'Search keywords' } },
    required: ['query'],
  },
};

const searchServicesDeclaration: FunctionDeclaration = {
  name: 'search_services',
  description: 'Search for general citizen services, documents, and certificates (e.g. Aadhar, PAN, Passport).',
  parameters: {
    type: SchemaType.OBJECT,
    properties: { query: { type: SchemaType.STRING, description: 'Search keywords' } },
    required: ['query'],
  },
};

export const getAiResponse = async (req: Request | any, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ status: 'error', message: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ status: 'error', message: 'GEMINI_API_KEY is missing in environment variables' });
    }

    // --- PERSONALIZATION ---
    let userContext = '';
    if (req.user) {
      const { name, age, state, occupation, category } = req.user;
      userContext = `\n\nUSER PROFILE (Use this to personalize answers):
- Name: ${name || 'Unknown'}
- Age: ${age || 'Unknown'}
- State: ${state || 'Unknown'}
- Occupation: ${occupation || 'Unknown'}
- Category: ${category || 'Unknown'}`;
    }

    const systemInstruction = `You are OneGuide AI, an expert assistant for Indian Government Schemes, Scholarships, Jobs, and Citizen Services.
Your goal is to help citizens easily navigate and understand government initiatives.
Always be polite, concise, and provide highly accurate information.
If a user asks about eligibility, provide a clear breakdown of requirements.
Keep your answers brief but informative. Use Markdown for formatting (bolding, lists, links).
Do not hallucinate schemes that do not exist. If you don't know something, tell them to check the official portal.
When providing information on a specific scheme/job/scholarship, include its official URL if available.
Always explain *why* something is relevant if using the User Profile context.${userContext}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction,
      tools: [{
        functionDeclarations: [
          searchSchemesDeclaration,
          searchJobsDeclaration,
          searchScholarshipsDeclaration,
          searchServicesDeclaration,
        ],
      }],
    });

    // Format history for Gemini
    // We pop the last user message to send it directly, while the rest forms the history
    let history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Gemini API strict rule: The first message in history MUST be from the 'user'
    // If the frontend sent the initial assistant greeting first, we must remove it from history
    if (history.length > 0 && history[0].role === 'model') {
      history.shift();
    }
    
    const latestMessage = messages[messages.length - 1]?.content;
    
    const chat = model.startChat({
      history,
    });

    let result = await chat.sendMessage(latestMessage);
    let responseText = result.response.text();

    // --- TOOL EXECUTION ---
    const functionCalls = result.response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      // Execute the first tool call
      const call = functionCalls[0];
      const args = call.args as { query: string };
      let toolResults: any[] = [];

      try {
        if (call.name === 'search_schemes') {
          toolResults = await searchDatabase(Scheme, args.query);
        } else if (call.name === 'search_jobs') {
          toolResults = await searchDatabase(Job, args.query);
        } else if (call.name === 'search_scholarships') {
          toolResults = await searchDatabase(Scholarship, args.query);
        } else if (call.name === 'search_services') {
          const servRes = await searchDatabase(Service, args.query);
          const docRes = await searchDatabase(GovDocument, args.query);
          toolResults = [...servRes, ...docRes].slice(0, 5);
        }
      } catch (e) {
        console.error("Tool execution error", e);
      }

      // Send the tool response back to Gemini
      const secondResult = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: { results: toolResults.length > 0 ? toolResults : { message: "No results found." } }
        }
      }]);
      
      responseText = secondResult.response.text();
    }

    res.json({
      status: 'success',
      data: {
        role: 'assistant',
        content: responseText || 'Sorry, I am unable to process that right now.'
      }
    });

  } catch (error: any) {
    console.error('Gemini AI Error:', error.message || error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch AI response' });
  }
};
