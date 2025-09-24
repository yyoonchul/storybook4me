import { apiClient } from '@/shared/lib/api-client';
import { PresetCharactersResponse } from './types';

// Family feature API
export const familyApi = {
  async getPresetCharacters() {
    return apiClient.get<PresetCharactersResponse>('family/presets');
  },
};


