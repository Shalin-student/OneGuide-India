import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../../middleware/auth.middleware';
import { User } from '../users/user.model';
import { getDiscoveryRecordById } from '../services/service.controller';

// @desc    Get user profile with populated saved services
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const savedServices = await Promise.all(
      (user.savedServices || []).map((id) => getDiscoveryRecordById(String(id))),
    );

    res.status(200).json({
      status: 'success',
      data: { ...user, savedServices: savedServices.filter(Boolean) },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// @desc    Save a service to user profile
// @route   POST /api/v1/users/saved-services/:serviceId
// @access  Private
export const saveService = async (req: AuthRequest, res: Response) => {
  try {
    const serviceId = String(req.params.serviceId);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Validate that the ID belongs to an existing MongoDB-backed discovery record.
    const service = await getDiscoveryRecordById(serviceId);
    if (!service) {
      return res.status(404).json({ status: 'error', message: 'Service not found' });
    }

    if (user.savedServices?.some((id) => id.toString() === serviceId)) {
      return res.status(400).json({ status: 'error', message: 'Service already saved' });
    }

    user.savedServices = user.savedServices || [];
    user.savedServices.push(new mongoose.Types.ObjectId(service._id));
    await user.save();

    res.status(200).json({ status: 'success', message: 'Service saved successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

// @desc    Unsave a service from user profile
// @route   DELETE /api/v1/users/saved-services/:serviceId
// @access  Private
export const unsaveService = async (req: AuthRequest, res: Response) => {
  try {
    const serviceId = String(req.params.serviceId);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    user.savedServices = user.savedServices?.filter(
      (id) => id.toString() !== serviceId
    ) || [];
    
    await user.save();

    res.status(200).json({ status: 'success', message: 'Service removed successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
