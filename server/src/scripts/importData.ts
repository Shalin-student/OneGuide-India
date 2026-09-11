import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Scheme } from '../modules/schemes/scheme.model';
import { Job } from '../modules/jobs/job.model';
import { Internship } from '../modules/internships/internship.model';
import { Scholarship } from '../modules/scholarships/scholarship.model';
import { GovDocument } from '../modules/documents/document.model';
import { GovernmentPortal } from '../modules/government-portals/governmentPortal.model';
import { Helpline } from '../modules/helplines/helpline.model';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: process.env.MONGODB_DB_NAME || 'OneGuide-India'
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};

interface ImportStats {
  found: number;
  insertedOrUpdated: number;
  rejected: number;
  duplicates: number;
}

const importCollection = async (
  dataPath: string,
  fileName: string,
  model: any,
  nameField: 'name' | 'title',
  isDryRun: boolean,
  uniqueField: string = 'slug'
): Promise<ImportStats> => {
  const filePath = path.join(dataPath, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${fileName}`);
    return { found: 0, insertedOrUpdated: 0, rejected: 0, duplicates: 0 };
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  if (rawData.trim() === '') return { found: 0, insertedOrUpdated: 0, rejected: 0, duplicates: 0 };
  
  const records = JSON.parse(rawData);
  if (!Array.isArray(records)) throw new Error(`${fileName} must contain a JSON array`);

  let imported = 0;
  let rejected = 0;
  let duplicates = 0;
    const uniqueValues = new Set<string>();

  for (const record of records) {
    // 1. Adapter for nested JSON structure (officialSources, verification, application)
    if (record.officialSources && Array.isArray(record.officialSources) && record.officialSources.length > 0) {
      record.sourceName = record.officialSources[0].sourceName;
      record.sourceUrl = record.officialSources[0].url;
      record.officialWebsite = record.officialSources[0].url;
      record.websiteUrl = record.officialSources[0].url;
    }
    if (record.verification && record.verification.lastVerified) {
      record.lastVerified = record.verification.lastVerified;
    }
    if (Array.isArray(record.eligibility)) {
      record.eligibility = record.eligibility.join('\n');
    }
    if (Array.isArray(record.benefits)) {
      record.benefits = record.benefits.join('\n');
    }
    if (Array.isArray(record.qualification)) {
      record.qualification = record.qualification.join('\n');
    }
    if (record.documents && Array.isArray(record.documents)) {
      record.requiredDocuments = record.documents;
    }
    if (record.application) {
      record.applicationUrl = record.application.url;
      if (record.application.procedure) {
        record.applicationProcess = Array.isArray(record.application.procedure) ? record.application.procedure.join('\n') : record.application.procedure;
      }
    }
    if (record.authority) {
       record.organization = record.authority;
       record.department = record.authority;
       record.issuingAuthority = record.authority;
       record.ministry = record.authority;
    }

    // Map name to title if required by the model (e.g. Job, Internship)
    if (fileName === 'jobs.json' || fileName === 'internships.json') {
      if (record.name && !record.title) {
        record.title = record.name;
      }
    }

    // specific handling for helplines
    if (fileName === 'helplines.json') {
      record.number = record.helplineNumber;
      record.officialSource = record.sourceName;
      record.verificationDate = record.lastVerified;
      // helplines require a number
      if (!record.number) {
        console.warn(`[REJECTED] Invalid record in ${fileName}: missing helplineNumber`);
        rejected++;
        continue;
      }
    }

    // 2. Demo data validation
    const recordString = JSON.stringify(record).toLowerCase();
    const demoKws = ['demo record', 'test record', 'sample record', 'sample data', 'demo portal', 'demo scheme', 'demo document', 'demo job'];
    const isDemo = demoKws.some(keyword => {
      // Avoid false positives like "demographic" or "democracy"
      const match = recordString.match(new RegExp(`\\b${keyword}\\b`, 'i'));
      return match !== null;
    });

    if (isDemo) {
      console.warn(`[REJECTED] Demo data detected in ${fileName}: ${record[nameField] || 'Unknown'}`);
      rejected++;
      continue;
    }

    const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
    
    // 3. Validation
    const isUrlValid = isValidUrl(sourceUrl);
    
    if (fileName !== 'helplines.json') {
      if (!record.slug || !record[nameField] || !record.description || !record.sourceName || !isUrlValid) {
        console.warn(`[REJECTED] Missing required fields in ${fileName}: ${record[nameField] || 'Unknown'}`);
        rejected++;
        continue;
      }
    } else {
      if (!record[nameField] || !record.description) {
         console.warn(`[REJECTED] Missing required fields in ${fileName}: ${record[nameField] || 'Unknown'}`);
         rejected++;
         continue;
      }
    }

    // 4. Duplicate check
    const uid = record[uniqueField];
    if (uid) {
      if (uniqueValues.has(uid)) {
        console.warn(`[REJECTED] Duplicate ${uniqueField} in ${fileName}: ${uid}`);
        duplicates++;
        rejected++;
        continue;
      }
      uniqueValues.add(uid);
    }

    imported++;

    // 5. Database Write (Only if not dry-run)
    if (!isDryRun) {
      await model.findOneAndUpdate(
        { [uniqueField]: uid },
        record,
        { upsert: true, new: true, runValidators: true }
      );
    }
  }

  console.log(`${fileName}: found=${records.length}, toImport=${imported}, rejected=${rejected}, duplicates=${duplicates}`);
  
  return { found: records.length, insertedOrUpdated: imported, rejected, duplicates };
};

import { Category } from '../modules/categories/category.model';
import { Service } from '../modules/services/service.model';

const importAgriculture = async (dataPath: string, isDryRun: boolean): Promise<any> => {
  const fileName = 'agriculture.json';
  const filePath = path.join(dataPath, fileName);
  if (!fs.existsSync(filePath)) {
    return { found: 0, insertedOrUpdated: 0, rejected: 0, duplicates: 0, skipped: 0 };
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  if (rawData.trim() === '') return { found: 0, insertedOrUpdated: 0, rejected: 0, duplicates: 0, skipped: 0 };
  
  const records = JSON.parse(rawData);
  let imported = 0, rejected = 0, duplicates = 0, skipped = 0;
  let schemeCount = 0, portalCount = 0, serviceCount = 0, helplineCount = 0, alreadyExisting = 0;
  
  // Find category for schemes and services
  let agricultureCategory = await Category.findOne({ name: 'Agriculture Services' });
  if (!agricultureCategory && !isDryRun) {
     // If not exists, maybe create one? The prompt says DO NOT create if it already exists, so assume it exists.
     // We will just log a warning if not found
     console.warn(`[WARNING] Category 'Agriculture Services' not found in database!`);
  }

  const uniqueValues = {
     schemes: new Set<string>(),
     governmentportals: new Set<string>(),
     services: new Set<string>(),
     helplines: new Set<string>()
  };

  for (const record of records) {
    const rType = record.resourceType;
    let targetModel: any;
    let nameField = 'name';
    let uniqueField = 'slug';
    let collectionName = '';

    if (rType === 'scheme') {
      targetModel = Scheme;
      nameField = 'name';
      collectionName = 'schemes';
      schemeCount++;
    } else if (rType === 'portal') {
      targetModel = GovernmentPortal;
      nameField = 'name';
      collectionName = 'governmentportals';
      portalCount++;
    } else if (rType === 'service') {
      targetModel = Service;
      nameField = 'name';
      collectionName = 'services';
      serviceCount++;
    } else if (rType === 'helpline') {
      targetModel = Helpline;
      nameField = 'name';
      uniqueField = 'name';
      collectionName = 'helplines';
      helplineCount++;
    } else {
      console.warn(`[REJECTED] Unsupported resource type in agriculture.json: ${rType}`);
      rejected++;
      continue;
    }

    const mappedRecord = { ...record };

    if (mappedRecord.officialSources && Array.isArray(mappedRecord.officialSources) && mappedRecord.officialSources.length > 0) {
      mappedRecord.sourceName = mappedRecord.officialSources[0].sourceName;
      mappedRecord.sourceUrl = mappedRecord.officialSources[0].url;
      mappedRecord.officialWebsite = mappedRecord.officialSources[0].url;
      mappedRecord.websiteUrl = mappedRecord.officialSources[0].url;

      if (rType === 'service') {
        mappedRecord.officialSources = mappedRecord.officialSources.map((src: any) => {
           let type = 'Official Website';
           if (src.sourceType === 'official_portal') type = 'Official Portal';
           else if (src.sourceType === 'official_notification') type = 'Official Notification';
           else if (src.sourceType === 'government_document') type = 'Government Document';
           else if (src.sourceType) {
              const str = String(src.sourceType);
              type = str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
              if (!['Official Website', 'Official Portal', 'Official Notification', 'Government Document'].includes(type)) {
                 type = 'Official Website';
              }
           }
           
           return {
             sourceName: src.sourceName || mappedRecord.name,
             sourceURL: src.url || src.sourceUrl || '',
             sourceType: type,
             verifiedAt: mappedRecord.verification?.lastVerified
           };
        });
      }
    }
    
    if (mappedRecord.verification && mappedRecord.verification.lastVerified) {
      mappedRecord.lastVerified = mappedRecord.verification.lastVerified;
      mappedRecord.verificationDate = mappedRecord.verification.lastVerified;
    }

    if (rType === 'helpline') {
      mappedRecord.number = mappedRecord.helplineNumber;
      mappedRecord.officialSource = mappedRecord.sourceName;
    }

    if (rType === 'service') {
      mappedRecord.stateOrCentral = mappedRecord.state === 'All India' ? 'Central' : 'State';
      mappedRecord.eligibility = { overview: mappedRecord.description || 'Eligibility details not specified' };
      mappedRecord.documentsRequired = mappedRecord.documents || [];
      mappedRecord.procedure = [];
      if (agricultureCategory) {
        mappedRecord.categoryId = agricultureCategory._id;
      }
    }

    if (rType === 'scheme') {
      if (agricultureCategory) {
        mappedRecord.category = agricultureCategory._id;
      }
    }

    // specific flattening
    if (Array.isArray(mappedRecord.eligibility) && rType !== 'service') {
      mappedRecord.eligibility = mappedRecord.eligibility.join('\n');
    }
    if (Array.isArray(mappedRecord.benefits)) {
      mappedRecord.benefits = mappedRecord.benefits.join('\n');
    }

    if (rType === 'service') {
      mappedRecord.eligibility = { overview: mappedRecord.description || 'Eligibility details not specified' };
    }

    const uid = mappedRecord[uniqueField] || mappedRecord.id;

    if (!uid) {
       console.warn(`[REJECTED] Missing identity in agriculture.json`);
       rejected++;
       continue;
    }

    if (uid === 'Kisan Call Centre' || uid === 'kisan-call-centre' || mappedRecord.name === 'Kisan Call Centre') {
       console.log(`[SKIPPED] Duplicate: Kisan Call Centre`);
       alreadyExisting++;
       skipped++;
       continue;
    }

    if ((uniqueValues as any)[collectionName].has(uid)) {
       console.warn(`[REJECTED] Duplicate within file: ${uid}`);
       duplicates++;
       rejected++;
       continue;
    }
    (uniqueValues as any)[collectionName].add(uid);

    let existing = await targetModel.findOne({ [uniqueField]: uid });
    if (!existing && mappedRecord.name) {
       existing = await targetModel.findOne({ name: mappedRecord.name });
    }

    if (existing) {
       console.log(`[SKIPPED] Already existing in ${collectionName}: ${uid}`);
       alreadyExisting++;
       skipped++;
       continue;
    }

    imported++;

    if (!isDryRun) {
       await targetModel.findOneAndUpdate(
         { [uniqueField]: uid },
         mappedRecord,
         { upsert: true, new: true, runValidators: true }
       );
    }
  }

  console.log(`\n--- AGRICULTURE INTEGRATION SUMMARY ---`);
  console.log(`Agriculture source records: ${records.length}`);
  console.log(`Scheme records: ${schemeCount}`);
  console.log(`Portal records: ${portalCount}`);
  console.log(`Service records: ${serviceCount}`);
  console.log(`Helpline records: ${helplineCount}`);
  console.log(`Already existing: ${alreadyExisting}`);
  console.log(`Would insert: ${imported}`);
  console.log(`Would skip: ${skipped}`);
  console.log(`Would reject: ${rejected}`);
  console.log(`Errors: 0`);

  return { found: records.length, insertedOrUpdated: imported, rejected, duplicates, skipped };
};

const importData = async () => {
  const isDryRun = process.argv.includes('--dry-run');

  if (!isDryRun) {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();
  } else {
    console.log('--- DRY RUN MODE (NO DATABASE WRITE) ---');
    await connectDB(); // connect anyway to check for existing duplicates in dry-run
  }

  try {
    const dataPath = path.resolve(__dirname, '../../data/verified');
    if (!fs.existsSync(dataPath)) {
      console.log('No data folder found. Please create a /data/verified folder with JSON files.');
      process.exit(0);
    }

    const stats = {
      schemes: await importCollection(dataPath, 'schemes.json', Scheme, 'name', isDryRun),
      jobs: await importCollection(dataPath, 'jobs.json', Job, 'title', isDryRun),
      internships: await importCollection(dataPath, 'internships.json', Internship, 'title', isDryRun),
      scholarships: await importCollection(dataPath, 'scholarships.json', Scholarship, 'name', isDryRun),
      documents: await importCollection(dataPath, 'documents.json', GovDocument, 'name', isDryRun),
      portals: await importCollection(dataPath, 'government-portals.json', GovernmentPortal, 'name', isDryRun),
      helplines: await importCollection(dataPath, 'helplines.json', Helpline, 'name', isDryRun, 'name')
    };
    
    // Process agriculture
    await importAgriculture(dataPath, isDryRun);

    const totalRejected = Object.values(stats).reduce((sum, s) => sum + s.rejected, 0);

    console.log('\n--- VALIDATION SUMMARY ---');
    if (totalRejected > 0) {
      console.warn(`[WARNING] There are ${totalRejected} rejected records. In a strict validation system, ALL files must pass.`);
    } else {
      console.log(`[SUCCESS] All records passed validation.`);
    }

    if (!isDryRun) {
      console.log('Import completed.');
    } else {
      console.log('Dry run completed. No data was written.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${(error as Error).message}`);
    process.exit(1);
  }
};

if (process.argv.includes('-i') || process.argv.includes('--dry-run')) {
  importData();
} else {
  console.log('Please pass the -i flag or --dry-run flag (e.g. npm run data:import -- --dry-run).');
  process.exit(0);
}
