import mongoose, { Schema, Document } from 'mongoose';

export interface IScholarship extends Document {
  name: string;
  slug: string;
  provider?: string;
  ministry?: string;
  level?: string;
  state?: string;
  eligibility?: string;
  qualification?: string;
  category?: string;
  incomeLimit?: string;
  benefits?: string;
  requiredDocuments: string[];
  applicationStart?: Date;
  applicationDeadline?: Date;
  applicationUrl?: string;
  officialWebsite?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const scholarshipSchema = new Schema<IScholarship>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    provider: { type: String },
    ministry: { type: String },
    level: { type: String },
    state: { type: String },
    eligibility: { type: String },
    qualification: { type: String },
    category: { type: String },
    incomeLimit: { type: String },
    benefits: { type: String },
    requiredDocuments: [{ type: String }],
    applicationStart: { type: Date },
    applicationDeadline: { type: Date },
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

scholarshipSchema.index({ name: 'text', provider: 'text' });
scholarshipSchema.index({ state: 1 });
scholarshipSchema.index({ category: 1 });
scholarshipSchema.index({ status: 1 });

export const Scholarship = mongoose.model<IScholarship>('Scholarship', scholarshipSchema);
