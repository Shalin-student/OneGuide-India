import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category: mongoose.Types.ObjectId;
  subCategory?: string;
  ministry?: string;
  department?: string;
  level?: string;
  state?: string;
  eligibility?: string;
  ageLimit?: string;
  gender?: string;
  socialCategory?: string;
  disabilityEligibility?: string;
  minorityEligibility?: string;
  studentEligibility?: string;
  employmentStatus?: string;
  governmentEmployeeEligibility?: string;
  bplEligibility?: string;
  incomeLimit?: string;
  benefits?: string;
  requiredDocuments: string[];
  applicationProcess?: string;
  applicationUrl?: string;
  officialWebsite?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const schemeSchema = new Schema<IScheme>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: String },
    ministry: { type: String },
    department: { type: String },
    level: { type: String },
    state: { type: String },
    eligibility: { type: String },
    ageLimit: { type: String },
    gender: { type: String },
    socialCategory: { type: String },
    disabilityEligibility: { type: String },
    minorityEligibility: { type: String },
    studentEligibility: { type: String },
    employmentStatus: { type: String },
    governmentEmployeeEligibility: { type: String },
    bplEligibility: { type: String },
    incomeLimit: { type: String },
    benefits: { type: String },
    requiredDocuments: [{ type: String }],
    applicationProcess: { type: String },
    applicationUrl: { type: String },
    officialWebsite: { type: String },
    sourceName: { type: String },
    sourceUrl: { type: String },
    lastVerified: { type: Date },
    status: { type: String, default: 'Active' },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
schemeSchema.index({ name: 'text', description: 'text' });
schemeSchema.index({ state: 1 });
schemeSchema.index({ status: 1 });
schemeSchema.index({ level: 1 });
schemeSchema.index({ gender: 1 });
schemeSchema.index({ category: 1 });

export const Scheme = mongoose.model<IScheme>('Scheme', schemeSchema);
