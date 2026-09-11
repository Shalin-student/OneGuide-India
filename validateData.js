const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, './server/data/verified');

const filesToValidate = [
  { expectedName: 'schemes.json', actualName: 'schemes.json', nameField: 'name' },
  { expectedName: 'jobs.json', actualName: 'jobs & Exam.json', nameField: 'title' },
  { expectedName: 'scholarships.json', actualName: 'scholarships.json', nameField: 'name' },
  { expectedName: 'internships.json', actualName: 'internships.json', nameField: 'title' },
  { expectedName: 'documents.json', actualName: 'documents.json', nameField: 'name' },
  { expectedName: 'government-portals.json', actualName: 'government-portals.json', nameField: 'name' },
  { expectedName: 'helplines.json', actualName: 'helplines.json', nameField: 'name' }
];

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};

const summary = {};

filesToValidate.forEach((fileInfo) => {
  const filePathActual = path.join(dataPath, fileInfo.actualName);
  const filePathExpected = path.join(dataPath, fileInfo.expectedName);
  
  const targetFile = fs.existsSync(filePathActual) ? filePathActual : (fs.existsSync(filePathExpected) ? filePathExpected : null);

  if (!targetFile) {
    summary[fileInfo.expectedName] = { status: 'Missing', path: null };
    return;
  }

  try {
    const rawData = fs.readFileSync(targetFile, 'utf-8');
    const records = JSON.parse(rawData);

    if (!Array.isArray(records)) {
      summary[fileInfo.expectedName] = { status: 'Error', message: 'Not an array' };
      return;
    }

    const slugs = new Set();
    const demoKeywords = ['demo', 'sample', 'test record'];
    let duplicates = 0;
    let demoRecords = 0;
    let missingRequired = 0;
    let hasOfficialSourcesArray = 0;
    let invalidUrls = 0;

    records.forEach((record) => {
      let isDemo = false;
      const recordString = JSON.stringify(record).toLowerCase();
      if (demoKeywords.some(keyword => recordString.includes(keyword))) {
        isDemo = true;
        demoRecords++;
      }

      if (fileInfo.expectedName === 'documents.json' && record.source) {
        record.sourceName = record.source.sourceName;
        record.sourceUrl = record.source.sourceUrl;
        record.lastVerified = record.source.lastVerified;
      }

      const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
      const name = record[fileInfo.nameField];

      const missing = [];
      if (!record.slug) missing.push('slug');
      if (!name) missing.push(fileInfo.nameField);
      if (!record.description) missing.push('description');
      
      // Importer requires sourceName and a valid URL
      if (!record.sourceName) {
        missing.push('sourceName');
      }
      
      if (!isValidUrl(sourceUrl)) {
        missing.push('URL');
        invalidUrls++;
      }

      if (record.officialSources && Array.isArray(record.officialSources)) {
        hasOfficialSourcesArray++;
      }

      if (missing.length > 0) {
        missingRequired++;
      }

      if (record.slug) {
        if (slugs.has(record.slug)) {
          duplicates++;
        } else {
          slugs.add(record.slug);
        }
      }
    });

    summary[fileInfo.expectedName] = {
      status: 'Found',
      actualFileName: path.basename(targetFile),
      totalRecords: records.length,
      missingRequiredFields_ImporterSpecific: missingRequired,
      hasOfficialSourcesArray: hasOfficialSourcesArray,
      invalidUrls: invalidUrls,
      duplicates: duplicates,
      demoRecords: demoRecords
    };
  } catch (error) {
    summary[fileInfo.expectedName] = { status: 'Parse Error', message: error.message };
  }
});

console.log(JSON.stringify(summary, null, 2));
