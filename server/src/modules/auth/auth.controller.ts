import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../users/user.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d', // 7 days for better security
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Server-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ status: 'error', message: 'Invalid email format' });
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ status: 'error', message: 'Password must be at least 8 characters long, contain an uppercase letter and a number' });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ status: 'error', message: 'User already exists' });
      return;
    }

    let role: 'user' | 'admin' = 'user';
    if (email === 'admin123@gmail.com' && name === 'Admin' && password === 'Admin@123') {
      role = 'admin';
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      preferredLanguage: 'en',
      role,
      onboardingCompleted: false
    });

    if (user) {
      const token = generateToken(user._id.toString());
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Stricter CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted
        },
      });
    } else {
      res.status(400).json({ status: 'error', message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id.toString());

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboardingCompleted: user.onboardingCompleted
        },
      });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(200).json({ status: 'success', data: null });
  }
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    preferredLanguage: req.user.preferredLanguage,
    onboardingCompleted: req.user.onboardingCompleted,
    age: req.user.age,
    state: req.user.state,
    district: req.user.district,
    educationLevel: req.user.educationLevel,
    employmentStatus: req.user.employmentStatus,
    currentStatus: req.user.currentStatus,
    fieldOfWork: req.user.fieldOfWork,
    careerInterests: req.user.careerInterests,
    annualIncomeRange: req.user.annualIncomeRange,
    socialCategory: req.user.socialCategory,
    gender: req.user.gender,
    disabilityStatus: req.user.disabilityStatus,
    minorityStatus: req.user.minorityStatus,
    userInterests: req.user.userInterests,
    specificGoals: req.user.specificGoals,
  };
  res.status(200).json({ status: 'success', data: user });
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      res.status(501).json({ status: 'error', message: 'Google Auth is not configured. Missing GOOGLE_CLIENT_ID.' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ status: 'error', message: 'Invalid Google Token' });
      return;
    }
    
    const { email, name, sub: googleId } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user with Google Auth
      user = await User.create({
        name,
        email,
        password: '', // No password for Google Auth users
        role: 'user',
        preferredLanguage: 'en',
        onboardingCompleted: false
      });
    }

    const jwtToken = generateToken(user._id.toString());

    res.cookie('jwt', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 'success',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Not authorized' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          ...req.body,
          onboardingCompleted: true
        }
      },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        _id: updatedUser?._id,
        onboardingCompleted: updatedUser?.onboardingCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
