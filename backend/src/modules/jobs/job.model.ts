import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  description?: string;
  organization?: string;
  department?: string;
  jobType?: string;
  location?: string;
  state?: string;
  qualification?: string;
  experience?: string;
  ageLimit?: string;
  salary?: string;
  vacancies?: string;
  applicationStart?: Date;
  applicationDeadline?: Date;
  applicationUrl?: string;
  officialNotificationUrl?: string;
  officialWebsite?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    organization: { type: String },
    department: { type: String },
    jobType: { type: String },
    location: { type: String },
    state: { type: String },
    qualification: { type: String },
    experience: { type: String },
    ageLimit: { type: String },
    salary: { type: String },
    vacancies: { type: String },
    applicationStart: { type: Date },
    applicationDeadline: { type: Date },
    applicationUrl: { type: String },
    officialNotificationUrl: { type: String },
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

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ state: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ status: 1 });

export const Job = mongoose.model<IJob>('Job', jobSchema);
