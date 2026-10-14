import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedResource extends Document {
  userId: mongoose.Types.ObjectId;
  resourceId: string;
  resourceType: string;
  createdAt: Date;
  updatedAt: Date;
}

const savedResourceSchema = new Schema<ISavedResource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resourceId: { type: String, required: true },
    resourceType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Enforce uniqueness to prevent duplicate saves
savedResourceSchema.index({ userId: 1, resourceId: 1, resourceType: 1 }, { unique: true });
// Optimize for pagination of a user's newest bookmarks
savedResourceSchema.index({ userId: 1, createdAt: -1 });

export const SavedResource = mongoose.model<ISavedResource>('SavedResource', savedResourceSchema);
