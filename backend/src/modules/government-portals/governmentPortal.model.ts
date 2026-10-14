import mongoose, { Schema, Document } from 'mongoose';

export interface IGovernmentPortal extends Document {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  ministry?: string;
  department?: string;
  level?: string;
  state?: string;
  services: string[];
  websiteUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const governmentPortalSchema = new Schema<IGovernmentPortal>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    ministry: { type: String },
    department: { type: String },
    level: { type: String },
    state: { type: String },
    services: [{ type: String }],
    websiteUrl: { type: String },
    sourceName: { type: String },
    sourceUrl: { type: String },
    lastVerified: { type: Date },
    status: { type: String, default: 'Active' },
  },
  {
    timestamps: true,
  }
);

governmentPortalSchema.index({ name: 'text', description: 'text' });
governmentPortalSchema.index({ state: 1 });
governmentPortalSchema.index({ category: 1 });
governmentPortalSchema.index({ level: 1 });
governmentPortalSchema.index({ status: 1 });

export const GovernmentPortal = mongoose.model<IGovernmentPortal>('GovernmentPortal', governmentPortalSchema);
