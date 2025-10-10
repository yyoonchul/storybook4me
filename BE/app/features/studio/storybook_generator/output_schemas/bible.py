from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class CharacterType(str, Enum):
    """캐릭터 타입 정의"""
    PROTAGONIST = "protagonist"
    ANTAGONIST = "antagonist"
    SUPPORTING = "supporting"
    MENTOR = "mentor"
    HELPER = "helper"

class Character(BaseModel):
    """캐릭터 정보 - characters 테이블과 호환"""
    # 데이터베이스 필드와 직접 매핑
    id: Optional[str] = Field(None, description="캐릭터 고유 ID (UUID)")
    user_id: Optional[str] = Field(None, description="소유자 ID (Clerk sub)")
    character_name: str = Field(..., description="캐릭터 이름")
    description: Optional[str] = Field(None, description="캐릭터 설명")
    visual_features: Optional[str] = Field(None, description="외모 정보 (이미지 생성용)")
    image_url: Optional[str] = Field(None, description="캐릭터 이미지 URL")
    personality_traits: List[str] = Field(default_factory=list, description="성격 특성 배열")
    likes: List[str] = Field(default_factory=list, description="취향 배열")
    additional_info: Optional[Dict[str, Any]] = Field(None, description="추가 정보 (나이, 대명사 등)")
    is_preset: bool = Field(False, description="프리셋 캐릭터 여부")
    created_at: Optional[datetime] = Field(None, description="생성 시간")
    updated_at: Optional[datetime] = Field(None, description="수정 시간")
    
    # 스토리 개발용 추가 필드들
    character_type: CharacterType = Field(..., description="캐릭터 타입")
    age: Optional[int] = Field(None, description="나이 (additional_info에서 추출)")
    background: Optional[str] = Field(None, description="배경 스토리")
    motivation: Optional[str] = Field(None, description="동기 및 목표")
    fears: List[str] = Field(default_factory=list, description="두려움들")
    strengths: List[str] = Field(default_factory=list, description="강점들")
    weaknesses: List[str] = Field(default_factory=list, description="약점들")
    catchphrase: Optional[str] = Field(None, description="대표 대사나 습관어")
    relationship_with_protagonist: Optional[str] = Field(None, description="주인공과의 관계")
    
    class Config:
        """Pydantic 설정"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Setting(BaseModel):
    """배경 설정"""
    name: str = Field(..., description="장소명")
    time_period: str = Field(..., description="시간적 배경")
    location_type: str = Field(..., description="장소 유형 (예: 숲, 마을, 집)")
    description: str = Field(..., description="장소에 대한 상세 설명")
    atmosphere: str = Field(..., description="분위기 및 느낌")
    important_objects: List[str] = Field(..., description="중요한 물건들")
    color_palette: List[str] = Field(..., description="색상 팔레트")
    weather_season: str = Field(..., description="날씨나 계절")

class WorldBuilding(BaseModel):
    """세계관 구축"""
    world_rules: List[str] = Field(..., description="세계의 규칙들")
    magic_system: Optional[str] = Field(None, description="마법 체계 (해당하는 경우)")
    technology_level: str = Field(..., description="기술 수준")
    social_structure: str = Field(..., description="사회 구조")
    cultural_elements: List[str] = Field(..., description="문화적 요소들")
    language_style: str = Field(..., description="언어 스타일")

class Theme(BaseModel):
    """테마 정보"""
    main_theme: str = Field(..., description="주요 테마")
    sub_themes: List[str] = Field(..., description="부차적 테마들")
    moral_lesson: str = Field(..., description="도덕적 교훈")
    emotional_message: str = Field(..., description="감정적 메시지")
    age_appropriate_content: str = Field(..., description="연령별 적절성")

class StoryBibleSchema(BaseModel):
    """스토리북 바이블 스키마 - 캐릭터, 배경, 세계관 정의 (storybooks 테이블과 호환)"""
    
    # 데이터베이스 필드와 직접 매핑 (storybooks 테이블)
    id: Optional[str] = Field(None, description="동화책 고유 ID (UUID)")
    user_id: Optional[str] = Field(None, description="소유자 ID (Clerk sub)")
    title: str = Field(..., description="동화책 제목")
    cover_image_url: Optional[str] = Field(None, description="표지 이미지 URL")
    is_public: bool = Field(False, description="공개 여부 (Explore 페이지 표시)")
    status: str = Field("pending", description="생성 상태")
    creation_params: Optional[Dict[str, Any]] = Field(None, description="생성 시 사용된 파라미터")
    page_count: int = Field(0, description="페이지 수")
    view_count: int = Field(0, description="조회수")
    like_count: int = Field(0, description="좋아요 수")
    category: Optional[str] = Field(None, description="카테고리 (Sci-Fi, Fantasy 등)")
    tags: List[str] = Field(default_factory=list, description="태그 배열")
    character_ids: List[str] = Field(default_factory=list, description="사용된 캐릭터 ID 배열")
    created_at: Optional[datetime] = Field(None, description="생성 시간")
    updated_at: Optional[datetime] = Field(None, description="수정 시간")
    
    # 스토리 개발용 추가 필드들
    genre: str = Field(..., description="장르")
    target_age_range: str = Field(..., description="대상 연령대")
    
    # 캐릭터들
    characters: List[Character] = Field(..., description="등장 캐릭터들", min_items=1)
    
    # 배경 설정
    settings: List[Setting] = Field(..., description="배경 설정들", min_items=1)
    
    # 세계관
    world_building: WorldBuilding = Field(..., description="세계관 구축")
    
    # 테마 및 메시지
    themes: Theme = Field(..., description="테마 및 메시지")
    
    # 스토리 톤
    tone: str = Field(..., description="전체적인 톤 (예: 따뜻함, 모험적, 교육적)")
    mood: str = Field(..., description="분위기")
    
    # 언어 스타일
    language_style: str = Field(..., description="언어 사용 스타일")
    dialogue_style: str = Field(..., description="대화 스타일")
    narrative_voice: str = Field(..., description="서술자의 목소리")
    
    # 시각적 가이드라인
    art_style: str = Field(..., description="일러스트 스타일")
    color_scheme: str = Field(..., description="전체 색상 계획")
    visual_elements: List[str] = Field(..., description="중요한 시각적 요소들")
    
    # 교육적 요소
    educational_elements: List[str] = Field(..., description="교육적 요소들")
    interactive_elements: List[str] = Field(..., description="상호작용 요소들")
    
    # 완성도 검증
    character_consistency: str = Field(..., description="캐릭터 일관성 검증")
    world_coherence: str = Field(..., description="세계관 일관성 검증")
    theme_integration: str = Field(..., description="테마 통합도 검증")
    
    class Config:
        """Pydantic 설정"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def to_storybook_dict(self) -> Dict[str, Any]:
        """storybooks 테이블용 딕셔너리로 변환"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "cover_image_url": self.cover_image_url,
            "is_public": self.is_public,
            "status": self.status,
            "creation_params": {
                "genre": self.genre,
                "target_age_range": self.target_age_range,
                "tone": self.tone,
                "mood": self.mood,
                "language_style": self.language_style,
                "art_style": self.art_style,
                "color_scheme": self.color_scheme
            },
            "page_count": self.page_count,
            "view_count": self.view_count,
            "like_count": self.like_count,
            "category": self.category,
            "tags": self.tags,
            "character_ids": self.character_ids
        }
    
    def to_characters_list(self) -> List[Dict[str, Any]]:
        """characters 테이블용 리스트로 변환"""
        return [
            {
                "id": char.id,
                "user_id": char.user_id,
                "character_name": char.character_name,
                "description": char.description,
                "visual_features": char.visual_features,
                "image_url": char.image_url,
                "personality_traits": char.personality_traits,
                "likes": char.likes,
                "additional_info": char.additional_info,
                "is_preset": char.is_preset,
                "created_at": char.created_at,
                "updated_at": char.updated_at
            }
            for char in self.characters
        ]
    
    def get_character_by_name(self, name: str) -> Optional[Character]:
        """이름으로 캐릭터 조회"""
        for char in self.characters:
            if char.character_name == name:
                return char
        return None
    
    def get_protagonist(self) -> Optional[Character]:
        """주인공 캐릭터 조회"""
        for char in self.characters:
            if char.character_type == CharacterType.PROTAGONIST:
                return char
        return None
