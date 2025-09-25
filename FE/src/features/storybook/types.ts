// Frontend types aligned with backend Storybook models

export type StorybookStatus =
  | 'pending'
  | 'script_generating'
  | 'script_generated'
  | 'images_generating'
  | 'assembling'
  | 'complete'
  | 'failed'
  | 'canceled';

export interface StorybookSummary {
  id: string;
  title: string;
  coverImageUrl?: string | null; // maps from cover_image_url
  status: StorybookStatus;
  isPublic: boolean; // maps from is_public
  createdAt: string; // ISO
  pageCount: number;
  likeCount?: number;
  viewCount?: number;
}

export interface Storybook extends StorybookSummary {
  updatedAt?: string;
  category?: string;
  tags?: string[];
  characterIds?: string[];
  creationParams?: Record<string, any>;
  pages?: Page[];
}

export interface StorybookListResponse {
  storybooks: StorybookSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface StorybookResponse {
  storybook: Storybook;
}

export interface CreateStorybookRequest {
  title: string;
  characterIds?: string[];
  theme?: string;
  style?: string;
  pageCount?: number;
  prompt?: string;
}

export interface UpdateStorybookRequest {
  title?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateVisibilityRequest {
  isPublic: boolean;
}

// Page (maps from DB public.pages)
export interface Page {
  id: string;
  storybookId: string; // maps from storybook_id
  pageNumber: number;  // maps from page_number
  scriptText?: string; // maps from script_text
  imageUrl?: string;   // maps from image_url
  audioUrl?: string;   // maps from audio_url
  imagePrompt?: string; // maps from image_prompt
  imageStyle?: string; // maps from image_style
  characterIds?: string[];
  backgroundDescription?: string; // maps from background_description
  createdAt?: string;
}


