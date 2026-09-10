import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDoc extends MongooseDocument {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  issuingAuthority?: string;
  eligibility?: string;
  requiredDocuments: unknown[];
  applicationProcess?: unknown;
  applicationUrl?: string;
  officialWebsite?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

const documentSchema = new Schema<IDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    issuingAuthority: { type: String },
    eligibility: { type: Schema.Types.Mixed },
    requiredDocuments: [{ type: Schema.Types.Mixed }],
    applicationProcess: { type: Schema.Types.Mixed },
    applicationUrl: { type: String },
    officialWebsite: { type: String },
    sourceName: { type: String },
    sourceUrl: { type: String },
    lastVerified: { type: Date },
    status: { type: String, default: 'Active' },
  },
  {
    timestamps: true,
    strict: false,
  }
);

documentSchema.index({ name: 'text', description: 'text' });
documentSchema.index({ category: 1 });
documentSchema.index({ status: 1 });

export const GovDocument = mongoose.model<IDoc>('Document', documentSchema);
