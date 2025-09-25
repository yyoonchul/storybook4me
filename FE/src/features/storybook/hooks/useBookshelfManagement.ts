import { storybookApi } from '../api';
import { useSession } from '@clerk/clerk-react';

export function useBookshelfManagement() {
  const { session } = useSession();

  const toggleVisibility = async (storybookId: string, nextPublic: boolean) => {
    const token = await session?.getToken({ template: 'storybook4me' });
    await storybookApi.setVisibility(storybookId, { isPublic: nextPublic }, token || undefined);
  };

  const deleteStorybook = async (storybookId: string) => {
    const token = await session?.getToken({ template: 'storybook4me' });
    await storybookApi.delete(storybookId, token || undefined);
  };

  return { toggleVisibility, deleteStorybook };
}


