export type StorybookTitle = {
  id: string;
  title: string;
};

export type UpdateTitleRequest = {
  title: string;
};

export type PageContent = {
  id: string;
  page_number: number;
  script_text?: string;
  image_url?: string;
  audio_url?: string;
  image_prompt?: string;
  image_style?: string;
  character_ids?: string[];
  background_description?: string;
  created_at: string;
};

export type UpdatePageContentRequest = {
  script_text?: string;
  image_prompt?: string;
  image_style?: string;
  character_ids?: string[];
  background_description?: string;
};

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type StorybookPage = {
  id: string;
  storybook_id: string;
  page_number: number;
  script_text?: string;
  image_url?: string;
  audio_url?: string;
  image_prompt?: string;
  image_style?: string;
  character_ids?: string[];
  background_description?: string;
  created_at?: string;
};

export type StorybookData = {
  id: string;
  user_id: string;
  title: string;
  cover_image_url?: string;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at?: string;
  page_count: number;
  like_count?: number;
  view_count?: number;
  category?: string;
  tags?: string[];
  character_ids?: string[];
  creation_params?: Record<string, any>;
  pages?: StorybookPage[];
};

// Page Management Types
export type AddPageRequest = {
  content: {
    script_text?: string;
    image_prompt?: string;
    image_style?: string;
    character_ids?: string[];
    background_description?: string;
  };
};

export type AddPageResponse = {
  page: PageContent;
};

export type DeletePageResponse = {
  message: string;
  deleted_page_number: number;
};


