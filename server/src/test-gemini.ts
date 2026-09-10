import { getAiResponse } from './ai/ai.controller';
import express from 'express';

const req = {
  body: {
    messages: [
      { role: 'user', content: 'hi' }
    ]
  }
} as any;

const res = {
  json: (data: any) => console.log('Response JSON:', data),
  status: (code: number) => ({
    json: (data: any) => console.log(`Status ${code} JSON:`, data)
  })
} as any;

async function test() {
  await getAiResponse(req, res);
}

test();
