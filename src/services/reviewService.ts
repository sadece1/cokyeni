import api from './api';

export interface Review {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  campsite_id?: string;
  gear_id?: string;
  campsite_name?: string;
  gear_name?: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  visit_date?: string;
  would_recommend?: boolean;
  is_approved: boolean;
  is_featured: boolean;
  helpful_count: number;
  admin_response?: string;
  admin_response_date?: string;
  created_at: string;
  updated_at: string;
  review_type?: 'campsite' | 'gear';
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
  recommend_count?: number;
}

export interface CreateReviewData {
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  visit_date?: string;
  would_recommend?: boolean;
}

export const createCampsiteReview = async (
  campsiteId: string,
  data: CreateReviewData
): Promise<{ message: string; reviewId: string }> => {
  const response = await api.post(`/reviews-new/campsites/${campsiteId}`, data);
  return response.data;
};

export const createGearReview = async (
  gearId: string,
  data: CreateReviewData
): Promise<{ message: string; reviewId: string }> => {
  const response = await api.post(`/reviews-new/gear/${gearId}`, data);
  return response.data;
};

export const getCampsiteReviews = async (
  campsiteId: string,
  approvedOnly: boolean = true
): Promise<{ reviews: Review[]; stats: ReviewStats | null }> => {
  const params = approvedOnly ? '?approved=true' : '';
  const response = await api.get(`/reviews-new/campsites/${campsiteId}${params}`);
  return response.data;
};

export const getGearReviews = async (
  gearId: string,
  approvedOnly: boolean = true
): Promise<{ reviews: Review[]; stats: ReviewStats | null }> => {
  const params = approvedOnly ? '?approved=true' : '';
  const response = await api.get(`/reviews-new/gear/${gearId}${params}`);
  return response.data;
};

export const getAllReviews = async (
  type: 'all' | 'campsite' | 'gear' = 'all',
  status: 'all' | 'pending' | 'approved' = 'pending'
): Promise<{ reviews: Review[] }> => {
  const params = new URLSearchParams();
  if (type !== 'all') params.append('type', type);
  if (status !== 'all') params.append('status', status);
  const response = await api.get(`/reviews-new?${params.toString()}`);
  return response.data;
};

export const updateReviewStatus = async (
  reviewId: string,
  type: 'campsite' | 'gear',
  data: {
    is_approved: boolean;
    admin_response?: string;
  }
): Promise<{ message: string }> => {
  const response = await api.put(`/reviews-new/${type}s/${reviewId}`, data);
  return response.data;
};

export const markReviewHelpful = async (
  reviewId: string,
  type: 'campsite' | 'gear'
): Promise<{ message: string }> => {
  const response = await api.post(`/reviews-new/${type}s/${reviewId}/helpful`);
  return response.data;
};

export const reportReview = async (
  reviewId: string,
  type: 'campsite' | 'gear',
  reason: 'spam' | 'offensive' | 'fake' | 'irrelevant' | 'other',
  description?: string
): Promise<{ message: string }> => {
  const response = await api.post(`/reviews-new/${type}s/${reviewId}/report`, {
    reason,
    description,
  });
  return response.data;
};
