/**
 * Character types for the Family feature
 * Based on the characters table schema from DBTABLES.md
 */

export interface Character {
  id: string;                    // UUID
  user_id: string;               // Clerk user ID (sub)
  character_name: string;        // 캐릭터 이름
  description?: string;          // 캐릭터 설명
  visual_features?: string;      // 외모 정보 (이미지 생성용)
  image_url?: string;           // 캐릭터 이미지 URL
  personality_traits?: string[]; // 성격 특성 배열
  likes?: string[];             // 취향 배열
  additional_info?: {           // 추가 정보 (나이, 대명사 등)
    age?: number;
    pronouns?: string;
    [key: string]: any;
  };
  is_preset: boolean;           // 프리셋 캐릭터 여부
  created_at: string;           // ISO 8601 timestamp
  updated_at: string;           // ISO 8601 timestamp
}

// Request types
export interface CreateCharacterRequest {
  character_name: string;        // 필수
  description?: string;
  visual_features?: string;
  image_url?: string;
  personality_traits?: string[];
  likes?: string[];
  additional_info?: {
    age?: number;
    pronouns?: string;
    [key: string]: any;
  };
}

export interface UpdateCharacterRequest {
  character_name?: string;
  description?: string;
  visual_features?: string;
  image_url?: string;
  personality_traits?: string[];
  likes?: string[];
  additional_info?: {
    age?: number;
    pronouns?: string;
    [key: string]: any;
  };
}

// Response types
export interface CharacterResponse {
  character: Character;
}

export interface CharacterListResponse {
  characters: Character[];
  total: number;
  page?: number;
  limit?: number;
}

export interface PresetCharactersResponse {
  presets: Character[];
}

export interface DeleteResponse {
  message: string;
  deleted_id: string;
}

// Query parameters for list endpoint
export interface CharacterListParams {
  page?: number;
  limit?: number;
  include_presets?: boolean;
}
