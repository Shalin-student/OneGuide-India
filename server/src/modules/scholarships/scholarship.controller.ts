import { Request, Response } from 'express';
import { Scholarship } from '../scholarships/scholarship.model';

export const getScholarships = async (req: Request, res: Response) => {
  try {
    const scholarships = await Scholarship.find({});
    res.json({ status: 'success', data: scholarships });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getScholarshipBySlug = async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.findOne({ slug: req.params.slug });
    if (!scholarship) return res.status(404).json({ status: 'error', message: 'Scholarship not found' });
    res.json({ status: 'success', data: scholarship });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createScholarship = async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    res.status(201).json({ status: 'success', data: scholarship });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateScholarship = async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scholarship) return res.status(404).json({ status: 'error', message: 'Scholarship not found' });
    res.json({ status: 'success', data: scholarship });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteScholarship = async (req: Request, res: Response) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ status: 'error', message: 'Scholarship not found' });
    res.json({ status: 'success', message: 'Scholarship removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
