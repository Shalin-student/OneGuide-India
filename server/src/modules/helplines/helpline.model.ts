import mongoose, { Schema, Document } from 'mongoose';

export interface IHelpline extends Document {
  name: string;
  number: string;
  description: string;
  categoryId?: mongoose.Types.ObjectId;
  state?: string; // If specific to a state
  officialSource?: string;
  verificationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const helplineSchema = new Schema<IHelpline>(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    description: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    state: { type: String },
    officialSource: { type: String },
    verificationDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Helpline = mongoose.model<IHelpline>('Helpline', helplineSchema);
