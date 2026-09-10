import { Request, Response } from 'express';
import { Job } from '../jobs/job.model';

export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({});
    res.json({ status: 'success', data: jobs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getJobBySlug = async (req: Request, res: Response) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug });
    if (!job) return res.status(404).json({ status: 'error', message: 'Job not found' });
    res.json({ status: 'success', data: job });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ status: 'success', data: job });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ status: 'error', message: 'Job not found' });
    res.json({ status: 'success', data: job });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ status: 'error', message: 'Job not found' });
    res.json({ status: 'success', message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
