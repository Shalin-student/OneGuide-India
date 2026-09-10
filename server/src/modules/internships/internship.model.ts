import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  slug: string;
  description?: string;
  organization?: string;
  department?: string;
  location?: string;
  state?: string;
  eligibility?: string;
  qualification?: string;
  duration?: string;
  stipend?: string;
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

const internshipSchema = new Schema<IInternship>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    organization: { type: String },
    department: { type: String },
    location: { type: String },
    state: { type: String },
    eligibility: { type: String },
    qualification: { type: String },
    duration: { type: String },
    stipend: { type: String },
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

internshipSchema.index({ title: 'text', description: 'text' });
internshipSchema.index({ state: 1 });
internshipSchema.index({ status: 1 });

export const Internship = mongoose.model<IInternship>('Internship', internshipSchema);
