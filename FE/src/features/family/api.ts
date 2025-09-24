import { apiClient } from '@/shared/lib/api-client';
import { PresetCharactersResponse, CreateCharacterRequest, CharacterResponse } from './types';

// Family feature API
export const familyApi = {
  async getPresetCharacters() {
    return apiClient.get<PresetCharactersResponse>('family/presets');
  },
  async createCharacter(data: CreateCharacterRequest) {
    // Token will be auto-injected by apiClient via global provider
    return apiClient.post<CharacterResponse>('family', data);
  },
};


