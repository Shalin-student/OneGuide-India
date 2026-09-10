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

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
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

const importCollection = async (
  dataPath: string,
  fileName: string,
  model: any,
  nameField: 'name' | 'title',
) => {
  const filePath = path.join(dataPath, fileName);
  if (!fs.existsSync(filePath)) return;

  const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(records)) throw new Error(`${fileName} must contain a JSON array`);

  let imported = 0;
  let rejected = 0;
  let duplicates = 0;

  for (const record of records) {
    if (fileName === 'documents.json' && record.source) {
      record.sourceName = record.source.sourceName;
      record.sourceUrl = record.source.sourceUrl;
      record.lastVerified = record.source.lastVerified;
    }
    const sourceUrl = record.sourceUrl || record.officialWebsite || record.applicationUrl || record.websiteUrl;
    if (!record.slug || !record[nameField] || !record.description || !record.sourceName || !isValidUrl(sourceUrl)) {
      console.warn(`[REJECTED] Invalid record in ${fileName}: ${record[nameField] || 'Unknown'}`);
      rejected++;
      continue;
    }

    await model.findOneAndUpdate(
      { slug: record.slug },
      record,
      { upsert: true, new: true, runValidators: true }
    );
    imported++;
  }

  console.log(`${fileName}: imported=${imported}, rejected=${rejected}, duplicates=${duplicates}`);
};

const importData = async () => {
  await connectDB();

  try {
    const dataPath = path.resolve(__dirname, '../../../data/verified');
    if (!fs.existsSync(dataPath)) {
      console.log('No data folder found. Please create a /data/verified folder with JSON files.');
      process.exit(0);
    }

    await importCollection(dataPath, 'schemes.json', Scheme, 'name');
    await importCollection(dataPath, 'jobs.json', Job, 'title');
    await importCollection(dataPath, 'internships.json', Internship, 'title');
    await importCollection(dataPath, 'scholarships.json', Scholarship, 'name');
    await importCollection(dataPath, 'documents.json', GovDocument, 'name');
    await importCollection(dataPath, 'government-portals.json', GovernmentPortal, 'name');

    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${(error as Error).message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else {
  console.log('Please pass the -i flag (e.g. npm run data:import).');
  process.exit(0);
}
