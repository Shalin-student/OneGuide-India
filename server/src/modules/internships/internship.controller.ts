import { Request, Response } from 'express';
import { Internship } from '../internships/internship.model';

export const getInternships = async (req: Request, res: Response) => {
  try {
    const internships = await Internship.find({});
    res.json({ status: 'success', data: internships });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getInternshipBySlug = async (req: Request, res: Response) => {
  try {
    const internship = await Internship.findOne({ slug: req.params.slug });
    if (!internship) return res.status(404).json({ status: 'error', message: 'Internship not found' });
    res.json({ status: 'success', data: internship });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createInternship = async (req: Request, res: Response) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ status: 'success', data: internship });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateInternship = async (req: Request, res: Response) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!internship) return res.status(404).json({ status: 'error', message: 'Internship not found' });
    res.json({ status: 'success', data: internship });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteInternship = async (req: Request, res: Response) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) return res.status(404).json({ status: 'error', message: 'Internship not found' });
    res.json({ status: 'success', message: 'Internship removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
