import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './src/modules/users/user.model';

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Connected to:', process.env.MONGODB_URI);

    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('No admin user found! Creating one...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123', salt);
      await User.create({
        name: 'Admin',
        email: 'Admin123@gmail.com',
        password: hashedPassword,
        role: 'admin',
        preferredLanguage: 'en',
        onboardingCompleted: true
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user found. Updating credentials...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123', salt);
      admin.email = 'Admin123@gmail.com';
      admin.password = hashedPassword;
      await admin.save();
      console.log('Admin user updated successfully.');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

updateAdmin();
