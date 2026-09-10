import { Request, Response } from 'express';
import { Helpline } from '../helplines/helpline.model';

export const getHelplines = async (req: Request, res: Response) => {
  try {
    const helplines = await Helpline.find({}).populate('categoryId', 'name slug');
    res.json({ status: 'success', data: helplines });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createHelpline = async (req: Request, res: Response) => {
  try {
    const helpline = await Helpline.create(req.body);
    res.status(201).json({ status: 'success', data: helpline });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateHelpline = async (req: Request, res: Response) => {
  try {
    const helpline = await Helpline.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!helpline) return res.status(404).json({ status: 'error', message: 'Helpline not found' });
    res.json({ status: 'success', data: helpline });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteHelpline = async (req: Request, res: Response) => {
  try {
    const helpline = await Helpline.findByIdAndDelete(req.params.id);
    if (!helpline) return res.status(404).json({ status: 'error', message: 'Helpline not found' });
    res.json({ status: 'success', message: 'Helpline removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
