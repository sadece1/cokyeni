import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getCategories,
  getCategoryTree,
  getCategoryById,
  getCategoryBySlug as getCategoryBySlugService,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import { asyncHandler } from '../middleware/errorHandler';
import { parseDate } from '../utils/helpers';

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await getCategories();
  res.status(200).json({
    success: true,
    data: categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      parentId: c.parent_id,
      icon: c.icon,
      order: c.order,
      createdAt: parseDate(c.created_at),
      updatedAt: parseDate(c.updated_at),
    })),
  });
});

export const getTree = asyncHandler(async (req: Request, res: Response) => {
  const tree = await getCategoryTree();
  res.status(200).json({ success: true, data: tree });
});

export const getSingleCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await getCategoryById(id);
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  res.status(200).json({
    success: true,
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: (category as any).parent_id,
      icon: category.icon,
      order: category.order,
      createdAt: parseDate((category as any).created_at),
      updatedAt: parseDate((category as any).updated_at),
    },
  });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const category = await getCategoryBySlugService(slug);
  if (!category) {
    res.status(404).json({ success: false, message: 'Category not found' });
    return;
  }
  res.status(200).json({
    success: true,
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: (category as any).parent_id,
      icon: category.icon,
      order: category.order,
      createdAt: parseDate((category as any).created_at),
      updatedAt: parseDate((category as any).updated_at),
    },
  });
});

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const category = await createCategory(req.body);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: (category as any).parent_id,
      icon: category.icon,
      order: category.order,
      createdAt: parseDate((category as any).created_at),
      updatedAt: parseDate((category as any).updated_at),
    },
  });
});

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const category = await updateCategory(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: (category as any).parent_id,
      icon: category.icon,
      order: category.order,
      createdAt: parseDate((category as any).created_at),
      updatedAt: parseDate((category as any).updated_at),
    },
  });
});

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteCategory(id);
  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});












