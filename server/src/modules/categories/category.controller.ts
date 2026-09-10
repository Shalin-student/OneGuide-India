import { Request, Response } from 'express';
import { Category } from '../categories/category.model';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.json({ status: 'success', data: categories });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' });
    res.json({ status: 'success', data: category });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ status: 'error', message: 'Category not found' });
    res.json({ status: 'success', message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
