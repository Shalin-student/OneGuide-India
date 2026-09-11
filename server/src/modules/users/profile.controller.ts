import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { User, IUser } from '../users/user.model';

const calculateCompleteness = (user: IUser) => {
  const keyFields = [
    'age',
    'state',
    'district',
    'educationLevel',
    'employmentStatus',
    'annualIncomeRange',
    'socialCategory',
    'gender',
    'preferredLanguage'
  ];

  const missingFields: string[] = [];
  let filledCount = 0;

  keyFields.forEach(field => {
    // @ts-ignore
    if (user[field] !== undefined && user[field] !== null && user[field] !== '') {
      filledCount++;
    } else {
      missingFields.push(field);
    }
  });

  const percentage = Math.round((filledCount / keyFields.length) * 100);
  const completed = percentage === 100;

  return { completed, percentage, missingFields };
};

// @desc    Get user profile with completeness
// @route   GET /api/v1/users/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const completeness = calculateCompleteness(user);

    res.status(200).json({
      status: 'success',
      data: {
        ...user.toObject(),
        completeness
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// @desc    Update user profile
// @route   PATCH /api/v1/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    // Allowed fields for profile update
    const allowedFields = [
      'age',
      'state',
      'district',
      'educationLevel',
      'employmentStatus',
      'currentStatus',
      'fieldOfWork',
      'careerInterests',
      'annualIncomeRange',
      'socialCategory',
      'gender',
      'disabilityStatus',
      'minorityStatus',
      'userInterests',
      'specificGoals',
      'preferredLanguage',
      'onboardingCompleted'
    ];

    const updates: Record<string, any> = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(500).json({ status: 'error', message: 'Failed to update profile' });
      return;
    }

    const completeness = calculateCompleteness(updatedUser);

    res.status(200).json({
      status: 'success',
      data: {
        ...updatedUser.toObject(),
        completeness
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
