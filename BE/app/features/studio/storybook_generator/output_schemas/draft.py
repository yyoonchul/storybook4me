from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class ScriptElementType(str, Enum):
    """스크립트 요소 타입"""
    NARRATION = "narration"
    DIALOGUE = "dialogue"
    ACTION = "action"
    SOUND_EFFECT = "sound_effect"
    VISUAL_CUE = "visual_cue"

class ScriptElement(BaseModel):
    """스크립트 개별 요소"""
    element_type: ScriptElementType = Field(..., description="요소 타입")
    content: str = Field(..., description="내용")
    character: Optional[str] = Field(None, description="대화자 (대화인 경우)")
    emotion: Optional[str] = Field(None, description="감정 표현")
    visual_description: Optional[str] = Field(None, description="시각적 설명")

class SpreadScript(BaseModel):
    """스프레드별 스크립트"""
    spread_number: int = Field(..., description="스프레드 번호")
    page_numbers: str = Field(..., description="페이지 번호 범위")
    elements: List[ScriptElement] = Field(..., description="스크립트 요소들")
    page_turn_moment: str = Field(..., description="페이지 턴 순간")
    visual_focus: str = Field(..., description="시각적 포커스")
    emotional_tone: str = Field(..., description="감정적 톤")

class Beat(BaseModel):
    """비트 (세부 장면 단위)"""
    beat_number: int = Field(..., description="비트 번호")
    description: str = Field(..., description="비트 설명")
    script_elements: List[ScriptElement] = Field(..., description="해당 비트의 스크립트 요소들")
    pacing: str = Field(..., description="페이싱 (빠름/보통/느림)")
    tension_level: int = Field(..., description="긴장도 (1-10)")

class EventScript(BaseModel):
    """이벤트별 스크립트"""
    event_number: int = Field(..., description="이벤트 번호")
    event_description: str = Field(..., description="이벤트 설명")
    first_line: str = Field(..., description="첫 번째 문장")
    last_line: str = Field(..., description="마지막 문장")
    beats: List[Beat] = Field(..., description="해당 이벤트의 비트들")
    emotional_arc: str = Field(..., description="감정적 여정")
    key_moments: List[str] = Field(..., description="주요 순간들")

class PageData(BaseModel):
    """페이지 데이터 - pages 테이블과 호환"""
    id: Optional[str] = Field(None, description="페이지 고유 ID (UUID)")
    storybook_id: Optional[str] = Field(None, description="소속 동화책 ID")
    page_number: int = Field(..., description="페이지 번호")
    script_text: str = Field(..., description="페이지 텍스트 내용")
    image_url: Optional[str] = Field(None, description="페이지 이미지 URL")
    audio_url: Optional[str] = Field(None, description="TTS 오디오 URL")
    image_prompt: Optional[str] = Field(None, description="이미지 생성 프롬프트")
    image_style: Optional[str] = Field(None, description="이미지 스타일")
    character_ids: List[str] = Field(default_factory=list, description="페이지에 등장하는 캐릭터 ID 배열")
    background_description: Optional[str] = Field(None, description="배경 설명")
    created_at: Optional[datetime] = Field(None, description="생성 시간")

class StoryDraftSchema(BaseModel):
    """스토리북 드래프트 스키마 - 최종 스크립트 생성 (pages 테이블과 호환)"""
    
    # 기본 정보
    title: str = Field(..., description="스토리북 제목")
    total_pages: int = Field(28, description="총 페이지 수")
    total_spreads: int = Field(14, description="총 스프레드 수")
    
    # 스토리북 메타데이터 (storybooks 테이블 연동)
    storybook_id: Optional[str] = Field(None, description="동화책 ID (storybooks 테이블)")
    user_id: Optional[str] = Field(None, description="사용자 ID (Clerk sub)")
    
    # 전체 스크립트
    complete_script: str = Field(..., description="완성된 전체 스크립트")
    
    # 스프레드별 스크립트
    spread_scripts: List[SpreadScript] = Field(..., description="14개 스프레드별 스크립트", min_items=14, max_items=14)
    
    # 이벤트별 스크립트
    event_scripts: List[EventScript] = Field(..., description="10개 이벤트별 스크립트", min_items=10, max_items=10)
    
    # 페이지 데이터 (pages 테이블용)
    pages: List[PageData] = Field(..., description="28개 페이지 데이터", min_items=28, max_items=28)
    
    # 언어 및 스타일
    language_style: str = Field(..., description="언어 스타일")
    vocabulary_level: str = Field(..., description="어휘 수준")
    sentence_length: str = Field(..., description="문장 길이 가이드라인")
    repetition_patterns: List[str] = Field(..., description="반복 패턴들")
    
    # 페이지 턴 전략
    page_turn_hooks: List[str] = Field(..., description="페이지 턴 갈고리들")
    cliffhangers: List[str] = Field(..., description="클리프행어들")
    anticipation_builders: List[str] = Field(..., description="기대감 조성 요소들")
    
    # 시각적 가이드
    visual_descriptions: List[str] = Field(..., description="시각적 설명들")
    color_notes: List[str] = Field(..., description="색상 관련 노트들")
    composition_notes: List[str] = Field(..., description="구성 관련 노트들")
    
    # 감정적 여정
    emotional_highlights: List[str] = Field(..., description="감정적 하이라이트들")
    tension_curve: str = Field(..., description="긴장도 곡선")
    catharsis_moments: List[str] = Field(..., description="카타르시스 순간들")
    
    # 상호작용 요소
    interactive_moments: List[str] = Field(..., description="상호작용 가능한 순간들")
    reader_participation: List[str] = Field(..., description="독자 참여 요소들")
    
    # 교육적 요소
    learning_moments: List[str] = Field(..., description="학습 순간들")
    moral_lessons: List[str] = Field(..., description="도덕적 교훈들")
    vocabulary_building: List[str] = Field(..., description="어휘 구축 요소들")
    
    # 완성도 검증
    pacing_analysis: str = Field(..., description="페이싱 분석")
    character_voice_consistency: str = Field(..., description="캐릭터 목소리 일관성")
    theme_integration: str = Field(..., description="테마 통합도")
    age_appropriateness: str = Field(..., description="연령 적절성")
    readability_score: str = Field(..., description="가독성 점수")
    
    # 최종 검토 사항
    final_review_notes: List[str] = Field(..., description="최종 검토 노트들")
    revision_suggestions: List[str] = Field(..., description="수정 제안사항들")
    strengths: List[str] = Field(..., description="강점들")
    areas_for_improvement: List[str] = Field(..., description="개선 영역들")
    
    class Config:
        """Pydantic 설정"""
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
    def to_storybook_dict(self) -> Dict[str, Any]:
        """storybooks 테이블용 딕셔너리로 변환"""
        return {
            "id": self.storybook_id,
            "user_id": self.user_id,
            "title": self.title,
            "cover_image_url": None,  # 표지는 별도 생성
            "is_public": False,
            "status": "draft",
            "creation_params": {
                "language_style": self.language_style,
                "vocabulary_level": self.vocabulary_level,
                "art_style": self.visual_descriptions[0] if self.visual_descriptions else None,
                "total_pages": self.total_pages,
                "total_spreads": self.total_spreads
            },
            "page_count": self.total_pages,
            "view_count": 0,
            "like_count": 0,
            "category": None,  # 별도 설정 필요
            "tags": [],
            "character_ids": []  # 별도 설정 필요
        }
    
    def to_pages_list(self) -> List[Dict[str, Any]]:
        """pages 테이블용 리스트로 변환"""
        return [
            {
                "id": None,
                "storybook_id": self.storybook_id,
                "page_number": page.page_number,
                "script_text": page.script_text,
                "image_url": page.image_url,
                "audio_url": page.audio_url,
                "image_prompt": page.image_prompt,
                "image_style": page.image_style,
                "character_ids": page.character_ids,
                "background_description": page.background_description,
                "created_at": None
            }
            for page in self.pages
        ]
    
    def get_page_by_number(self, page_number: int) -> Optional[PageData]:
        """페이지 번호로 페이지 데이터 조회"""
        for page in self.pages:
            if page.page_number == page_number:
                return page
        return None
    
    def get_spread_by_number(self, spread_number: int) -> Optional[SpreadScript]:
        """스프레드 번호로 스프레드 스크립트 조회"""
        for spread in self.spread_scripts:
            if spread.spread_number == spread_number:
                return spread
        return None
