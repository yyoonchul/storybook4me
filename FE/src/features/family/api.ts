import { apiClient } from '@/shared/lib/api-client';
import { PresetCharactersResponse, CreateCharacterRequest, CharacterResponse, CharacterListResponse, CharacterListParams, UpdateCharacterRequest, DeleteResponse } from './types';

// Family feature API
export const familyApi = {
  async getCharacters(params: CharacterListParams = {}, token?: string) {
    const search = new URLSearchParams();
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (typeof params.include_presets === 'boolean') search.set('include_presets', String(params.include_presets));
    const endpoint = search.toString() ? `family?${search.toString()}` : 'family';
    return apiClient.get<CharacterListResponse>(endpoint, token);
  },
  async getPresetCharacters() {
    return apiClient.get<PresetCharactersResponse>('family/presets');
  },
  async getCharacter(id: string) {
    return apiClient.get<CharacterResponse>(`family/${id}`);
  },
  async updateCharacter(id: string, data: UpdateCharacterRequest) {
    return apiClient.put<CharacterResponse>(`family/${id}`, data);
  },
  async deleteCharacter(id: string) {
    return apiClient.delete<DeleteResponse>(`family/${id}`);
  },
  async createCharacter(data: CreateCharacterRequest) {
    // Token will be auto-injected by apiClient via global provider
    return apiClient.post<CharacterResponse>('family', data);
  },
};


