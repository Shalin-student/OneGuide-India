import { Request, Response } from 'express';
import { GovernmentPortal } from '../government-portals/governmentPortal.model';

export const getGovernmentPortals = async (req: Request, res: Response) => {
  try {
    const portals = await GovernmentPortal.find({});
    res.json({ status: 'success', data: portals });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getGovernmentPortalBySlug = async (req: Request, res: Response) => {
  try {
    const portal = await GovernmentPortal.findOne({ slug: req.params.slug });
    if (!portal) return res.status(404).json({ status: 'error', message: 'Government Portal not found' });
    res.json({ status: 'success', data: portal });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createGovernmentPortal = async (req: Request, res: Response) => {
  try {
    const portal = await GovernmentPortal.create(req.body);
    res.status(201).json({ status: 'success', data: portal });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateGovernmentPortal = async (req: Request, res: Response) => {
  try {
    const portal = await GovernmentPortal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!portal) return res.status(404).json({ status: 'error', message: 'Government Portal not found' });
    res.json({ status: 'success', data: portal });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteGovernmentPortal = async (req: Request, res: Response) => {
  try {
    const portal = await GovernmentPortal.findByIdAndDelete(req.params.id);
    if (!portal) return res.status(404).json({ status: 'error', message: 'Government Portal not found' });
    res.json({ status: 'success', message: 'Government Portal removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
