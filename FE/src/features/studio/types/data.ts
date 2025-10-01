export type StorybookTitle = {
  id: string;
  title: string;
};

export type UpdateTitleRequest = {
  title: string;
};

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';


