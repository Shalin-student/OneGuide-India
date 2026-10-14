const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'verified', 'schemes.json');
const schemes = JSON.parse(fs.readFileSync(file, 'utf-8'));

let reqPass = true;
let dupPass = true;
let urlPass = true;
let verPass = true;
let demoPass = true;

const slugs = new Set();
const demoKeywords = ['unverified-demo', 'demo', 'sample', 'placeholder', 'generated'];

for (const s of schemes) {
  // Required fields
  if (!s.slug || !s.name || !s.description || !s.authority || !s.officialSources || !s.verification || !s.verification.lastVerified || !s.eligibility || !s.benefits || !s.documents || !s.application) {
    reqPass = false;
    console.log(`Missing required fields in: ${s.name || 'Unknown'}`);
  }

  // Duplicates
  if (s.slug) {
    if (slugs.has(s.slug)) {
      dupPass = false;
      console.log(`Duplicate slug: ${s.slug}`);
    }
    slugs.add(s.slug);
  }

  // URLs
  if (s.officialSources) {
    for (const src of s.officialSources) {
      try {
        new URL(src.url);
      } catch (e) {
        urlPass = false;
        console.log(`Invalid URL in ${s.name}: ${src.url}`);
      }
    }
  }

  // Verification
  if (!s.verification || !s.verification.status || s.verification.status !== 'verified') {
    verPass = false;
    console.log(`Invalid verification in: ${s.name}`);
  }

  // Demo Contamination
  const jsonStr = JSON.stringify(s).toLowerCase();
  for (const word of demoKeywords) {
    if (jsonStr.includes(word)) {
      demoPass = false;
      console.log(`Demo contamination found in ${s.name}: contains word '${word}'`);
    }
  }
}

console.log(`Count: ${schemes.length}`);
console.log(`Required fields: ${reqPass ? 'PASS' : 'FAIL'}`);
console.log(`Duplicate slugs: ${dupPass ? 'PASS' : 'FAIL'}`);
console.log(`URLs: ${urlPass ? 'PASS' : 'FAIL'}`);
console.log(`Verification fields: ${verPass ? 'PASS' : 'FAIL'}`);
console.log(`Demo contamination: ${demoPass ? 'PASS' : 'FAIL'}`);
