import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  governmentDepartment?: string;
  stateOrCentral: 'State' | 'Central';
  state?: string; // If State, which state
  status: 'Active' | 'Inactive' | 'Archived';
  
  eligibility: {
    overview: string;
    ageRange?: { min?: number; max?: number };
    occupations?: string[]; // e.g., Farmer, Student
    socialCategories?: string[]; // General, OBC, SC, ST
    genders?: string[]; // Male, Female, Other
    incomeRange?: { min?: number; max?: number };
    bplRequired?: boolean;
    disabilityRequired?: boolean;
    studentRequired?: boolean;
  };

  documentsRequired: string[];
  benefits: string[];
  procedure: { stepNumber: number; title: string; description: string }[];
  fees?: string;
  processingTime?: string;
  
  officialSources: {
    sourceName: string;
    sourceURL: string;
    sourceType: 'Official Website' | 'Official Portal' | 'Official Notification' | 'Government Document';
    verifiedAt?: Date;
  }[];

  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    governmentDepartment: { type: String },
    stateOrCentral: { type: String, enum: ['State', 'Central'], required: true },
    state: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Archived'], default: 'Active' },
    
    eligibility: {
      overview: { type: String, required: true },
      ageRange: { min: Number, max: Number },
      occupations: [{ type: String }],
      socialCategories: [{ type: String }],
      genders: [{ type: String }],
      incomeRange: { min: Number, max: Number },
      bplRequired: { type: Boolean },
      disabilityRequired: { type: Boolean },
      studentRequired: { type: Boolean },
    },

    documentsRequired: [{ type: String }],
    benefits: [{ type: String }],
    procedure: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      }
    ],
    fees: { type: String },
    processingTime: { type: String },

    officialSources: [
      {
        sourceName: { type: String, required: true },
        sourceURL: { type: String, required: true },
        sourceType: { type: String, enum: ['Official Website', 'Official Portal', 'Official Notification', 'Government Document'], required: true },
        verifiedAt: { type: Date },
      }
    ],

    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
