import { Request, Response } from 'express';
import { Scheme } from '../schemes/scheme.model';

export const getSchemes = async (req: Request, res: Response) => {
  try {
    const { state, age, gender, category, income, employmentStatus, bpl, isGovEmployee, isStudent, disability, minority } = req.query;
    
    let query: any = { status: 'Active' };

    if (state && state !== 'All India' && state !== '') {
      query.$or = [{ state: state }, { state: 'All India' }];
    }
    
    if (age) {
      // If ageLimit exists on a scheme, the user must be <= ageLimit or scheme is open to all.
      // E.g., SSY ageLimit is 10. If user is 12, they don't match. 
      // If user is 8, they match.
      query.$or = [
        { ageLimit: { $exists: false } },
        { ageLimit: null },
        { ageLimit: '' },
        { ageLimit: { $gte: String(age) } } // String comparison works if they are numbers stored as strings, but better to handle properly. In IScheme ageLimit is string. 
      ];
    }

    if (gender && gender !== 'Prefer not to say') {
      query.$or = [
        { gender: { $exists: false } },
        { gender: null },
        { gender: '' },
        { gender: gender }
      ];
    }
    
    // We can add more specific matching logic here as needed for the other fields, 
    // but for this step we will rely on basic match or exists/null.
    
    const schemes = await Scheme.find(query).populate('category', 'name slug');
    res.json({ status: 'success', data: schemes });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getSchemeBySlug = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!scheme) return res.status(404).json({ status: 'error', message: 'Scheme not found' });
    res.json({ status: 'success', data: scheme });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createScheme = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ status: 'success', data: scheme });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateScheme = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) return res.status(404).json({ status: 'error', message: 'Scheme not found' });
    res.json({ status: 'success', data: scheme });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteScheme = async (req: Request, res: Response) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ status: 'error', message: 'Scheme not found' });
    res.json({ status: 'success', message: 'Scheme removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
