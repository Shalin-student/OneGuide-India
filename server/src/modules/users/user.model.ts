import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  preferredLanguage: 'en' | 'hi' | 'gu';
  age?: number;
  dateOfBirth?: Date;
  state?: string;
  district?: string;
  role: 'user' | 'admin';
  savedServices: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  
  // Onboarding Fields
  onboardingCompleted: boolean;
  educationLevel?: string;
  employmentStatus?: string;
  currentStatus?: string;
  fieldOfWork?: string;
  careerInterests?: string[];
  annualIncomeRange?: string;
  socialCategory?: string;
  gender?: string;
  disabilityStatus?: string;
  minorityStatus?: string;
  userInterests?: string[];
  specificGoals?: string[];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional if logged in with Google
    googleId: { type: String, unique: true, sparse: true },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'gu'],
      default: 'en',
    },
    age: { type: Number },
    dateOfBirth: { type: Date },
    state: { type: String },
    district: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // IDs can belong to any discovery collection (schemes, jobs, documents, etc.).
    savedServices: [{ type: Schema.Types.ObjectId }],

    // Onboarding Fields
    onboardingCompleted: { type: Boolean, default: false },
    educationLevel: { type: String },
    employmentStatus: { type: String },
    currentStatus: { type: String },
    fieldOfWork: { type: String },
    careerInterests: [{ type: String }],
    annualIncomeRange: { type: String },
    socialCategory: { type: String },
    gender: { type: String },
    disabilityStatus: { type: String },
    minorityStatus: { type: String },
    userInterests: [{ type: String }],
    specificGoals: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
