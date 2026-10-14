const fs = require('fs');
const path = require('path');

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};

const auditFile = (fileName, nameField) => {
  const filePath = path.join(__dirname, '..', '..', '..', 'data', 'verified', fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`${fileName}: DOES NOT EXIST`);
    return;
  }
  
  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let valid = 0, invalid = 0, missingMandatory = 0, malformedUrls = 0, missingSource = 0;
  let slugs = new Set();
  let duplicates = 0;

  for (const record of records) {
    if (fileName === 'documents.json' && record.source) {
      record.sourceName = record.source.sourceName;
      record.sourceUrl = record.source.sourceUrl;
      record.lastVerified = record.source.lastVerified;
    }
    
    let isInvalid = false;
    
    if (slugs.has(record.slug)) {
      duplicates++;
    }
    if (record.slug) slugs.add(record.slug);

    if (!record.slug || !record[nameField] || !record.description) {
      missingMandatory++;
      isInvalid = true;
    }

    if (!record.sourceName) {
      missingSource++;
      isInvalid = true;
    }

    const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
    if (!sourceUrl || !isValidUrl(sourceUrl)) {
      malformedUrls++;
      isInvalid = true;
    }

    if (isInvalid) invalid++;
    else valid++;
  }

  console.log(`--- ${fileName} AUDIT ---`);
  console.log(`Total Records: ${records.length}`);
  console.log(`Valid: ${valid}`);
  console.log(`Invalid (Failing Pipeline): ${invalid}`);
  console.log(`Missing Mandatory Fields: ${missingMandatory}`);
  console.log(`Missing Source Name: ${missingSource}`);
  console.log(`Malformed/Missing URLs: ${malformedUrls}`);
  console.log(`Duplicate Slugs: ${duplicates}`);
  console.log('----------------------\n');
};

auditFile('jobs.json', 'title');
auditFile('documents.json', 'name');
auditFile('schemes.json', 'name');
auditFile('scholarships.json', 'name');
auditFile('internships.json', 'title');
auditFile('government-portals.json', 'name');
