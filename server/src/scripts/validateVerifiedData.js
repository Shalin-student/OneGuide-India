const fs = require('fs');
const path = require('path');

const VERIFIED_DIR = path.join(__dirname, '..', '..', 'data', 'verified');

const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateFile = (fileName, nameField) => {
  const filePath = path.join(VERIFIED_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`[PASS] ${fileName} (File does not exist)`);
    return true;
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  if (rawData.trim() === '') {
    console.log(`[PASS] ${fileName} (Empty file)`);
    return true;
  }

  const records = JSON.parse(rawData);
  if (!Array.isArray(records)) {
    console.error(`[FAIL] ${fileName}: File root must be a JSON array.`);
    return false;
  }

  if (records.length === 0) {
    console.log(`[PASS] ${fileName} (0 records - Payload is safely empty)`);
    return true;
  }

  const slugs = new Set();
  let hasErrors = false;

  records.forEach((rec, idx) => {
    // Clone record to not mutate original
    const record = { ...rec };
    if (fileName === 'documents.json' && record.source) {
      record.sourceName = record.source.sourceName;
      record.sourceUrl = record.source.sourceUrl;
      record.lastVerified = record.source.lastVerified;
    }
    // Basic fields
    const name = record[nameField];
    if (!name || typeof name !== 'string') {
      console.error(`[FAIL] ${fileName}[${idx}]: Missing or invalid '${nameField}'.`);
      hasErrors = true;
    }

    if (!record.slug || typeof record.slug !== 'string' || record.slug.trim() === '') {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Missing or invalid 'slug'.`);
      hasErrors = true;
    } else if (slugs.has(record.slug)) {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Duplicate slug '${record.slug}'.`);
      hasErrors = true;
    } else {
      slugs.add(record.slug);
    }

    if (!record.description || typeof record.description !== 'string') {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Missing or invalid 'description'.`);
      hasErrors = true;
    }

    // Source fields
    if (!record.sourceName || typeof record.sourceName !== 'string') {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Missing 'sourceName' (Authoritative Organization).`);
      hasErrors = true;
    }

    const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
    if (!sourceUrl || !isValidUrl(sourceUrl)) {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Missing or malformed official URL.`);
      hasErrors = true;
    }
    
    // We cannot reliably ping the URL inside a synchronous script without async/await and robust timeout logic,
    // but we CAN enforce that it exists and looks valid.
    
    // Verification Status
    if (!record.lastVerified) {
      console.error(`[FAIL] ${fileName}[${idx}] (${name || 'Unknown'}): Missing 'lastVerified' (Verification Status). Records must explicitly state when they were verified.`);
      hasErrors = true;
    }
  });

  if (hasErrors) {
    console.error(`[FAIL] ${fileName} validation failed. Do NOT import.`);
    return false;
  }

  console.log(`[PASS] ${fileName} (${records.length} valid records)`);
  return true;
};

const runValidation = () => {
  let allPass = true;
  
  if (!validateFile('jobs.json', 'title')) allPass = false;
  if (!validateFile('documents.json', 'name')) allPass = false;
  if (!validateFile('schemes.json', 'name')) allPass = false;
  if (!validateFile('scholarships.json', 'name')) allPass = false;
  if (!validateFile('internships.json', 'title')) allPass = false;
  if (!validateFile('government-portals.json', 'name')) allPass = false;

  if (!allPass) {
    process.exit(1);
  } else {
    console.log('All active payload files passed validation.');
    process.exit(0);
  }
};

runValidation();
