import { Request, Response } from 'express';
import { GovDocument } from '../documents/document.model';

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await GovDocument.find({});
    res.json({ status: 'success', data: documents });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const getDocumentBySlug = async (req: Request, res: Response) => {
  try {
    const document = await GovDocument.findOne({ slug: req.params.slug });
    if (!document) return res.status(404).json({ status: 'error', message: 'Document not found' });
    res.json({ status: 'success', data: document });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const document = await GovDocument.create(req.body);
    res.status(201).json({ status: 'success', data: document });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const document = await GovDocument.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!document) return res.status(404).json({ status: 'error', message: 'Document not found' });
    res.json({ status: 'success', data: document });
  } catch (error) {
    res.status(400).json({ status: 'error', message: (error as Error).message });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const document = await GovDocument.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ status: 'error', message: 'Document not found' });
    res.json({ status: 'success', message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: (error as Error).message });
  }
};
