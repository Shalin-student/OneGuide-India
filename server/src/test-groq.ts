import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') }); // fixed path: from src/ to root/

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'hi' }],
      model: 'llama3-70b-8192',
    });
    console.log('Success:', completion.choices[0]?.message?.content);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
