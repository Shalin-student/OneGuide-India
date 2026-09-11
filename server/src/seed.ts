import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './modules/users/user.model';
import { Category } from './modules/categories/category.model';
import { Service } from './modules/services/service.model';
import { Helpline } from './modules/helplines/helpline.model';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Connected for Seeding to:', process.env.MONGODB_URI);

    // Only seed if DB is empty to prevent overwriting existing data
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already has data. Skipping seed to prevent data loss.');
      process.exit(0);
    }

    console.log('Database is empty. Proceeding with seed...');

    // 1. Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are strictly required for database initialization.');
      console.error('Please configure them in your .env file or environment safely.');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      preferredLanguage: 'en',
    });

    // 2. Create Categories
    const categories = await Category.insertMany([
      { name: 'Government Schemes', slug: 'government-schemes', description: 'Welfare and assistance programs.' },
      { name: 'Jobs & Exams', slug: 'jobs-exams', description: 'Recruitment and competitive exams.' },
      { name: 'Scholarships', slug: 'scholarships', description: 'Financial aid for students.' },
      { name: 'Agriculture Services', slug: 'agriculture-services', description: 'Support for farmers.' },
      { name: 'Documents & Certificates', slug: 'documents-certificates', description: 'Official documents.' },
    ]);

    const getCategoryId = (name: string) => categories.find(c => c.name === name)?._id;

    // 3. Create Services
    await Service.insertMany([
      {
        name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        slug: 'pm-kisan',
        categoryId: getCategoryId('Agriculture Services'),
        description: 'Income support scheme for farmer families.',
        governmentDepartment: 'Department of Agriculture & Farmers Welfare',
        stateOrCentral: 'Central',
        status: 'Active',
        eligibility: {
          overview: 'All landholding farmers families, which have cultivable landholding in their names are eligible.',
          occupations: ['Farmer'],
          studentRequired: false,
          ageRange: { min: 18 }
        },
        benefits: [
          'Financial benefit of Rs. 6000/- per year.',
          'Amount is transferred directly to the bank account in 3 equal installments.'
        ],
        documentsRequired: ['Aadhaar Card', 'Citizenship certificate', 'Landholding papers', 'Bank account details'],
        fees: 'Nil',
        processingTime: '1-3 months',
        procedure: [
          { stepNumber: 1, title: 'Check Eligibility', description: 'Ensure you have cultivable land in your name.' },
          { stepNumber: 2, title: 'Online Registration', description: 'Visit the official PM-Kisan portal and register.' }
        ],
        officialSources: [
          { sourceName: 'PM-Kisan Official Portal', sourceURL: 'https://pmkisan.gov.in/', sourceType: 'Official Portal' }
        ],
        tags: ['farmer', 'subsidy', 'agriculture']
      },
      {
        name: 'National Scholarship Portal (NSP)',
        slug: 'national-scholarship-portal',
        categoryId: getCategoryId('Scholarships'),
        description: 'One-stop platform for various government scholarships.',
        governmentDepartment: 'Ministry of Electronics & Information Technology',
        stateOrCentral: 'Central',
        status: 'Active',
        eligibility: {
          overview: 'Students from class 1 to PhD level belonging to SC/ST/OBC/Minority categories.',
          occupations: ['Student'],
          studentRequired: true,
          socialCategories: ['SC', 'ST', 'OBC', 'Minority']
        },
        benefits: [
          'Direct Benefit Transfer (DBT) of scholarship amount.'
        ],
        documentsRequired: ['Aadhaar Card', 'Educational Certificates', 'Income Certificate', 'Caste Certificate (if applicable)', 'Bank details'],
        fees: 'Nil',
        processingTime: '3-6 months (varies by scheme)',
        procedure: [
          { stepNumber: 1, title: 'Registration', description: 'Register on the NSP portal.' },
          { stepNumber: 2, title: 'Application', description: 'Fill in the application form and upload documents.' },
          { stepNumber: 3, title: 'Institution Verification', description: 'Your educational institution verifies the application.' }
        ],
        officialSources: [
          { sourceName: 'National Scholarship Portal', sourceURL: 'https://scholarships.gov.in/', sourceType: 'Official Portal' }
        ],
        tags: ['student', 'education', 'scholarship']
      }
    ]);

    // 4. Create Helplines
    await Helpline.insertMany([
      { name: 'National Emergency Number', number: '112', description: 'Single emergency number for police, fire, and ambulance.' },
      { name: 'Women Helpline', number: '1091', description: 'Women in distress.' },
      { name: 'Kisan Call Centre', number: '1800-180-1551', description: 'For agricultural queries and assistance.' }
    ]);

    console.log('Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

seedData();
