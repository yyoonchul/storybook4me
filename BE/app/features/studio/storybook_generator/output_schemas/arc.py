from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ArcType(str, Enum):
    """아크 타입 정의"""
    INTRODUCTION = "introduction"  # 1막: 도입
    DEVELOPMENT = "development"    # 2막: 전개  
    CLIMAX = "climax"             # 3막: 절정
    RESOLUTION = "resolution"     # 3막: 결말

class Spread(BaseModel):
    """개별 스프레드 정보"""
    spread_number: int = Field(..., description="스프레드 번호 (1-14)")
    page_numbers: str = Field(..., description="페이지 번호 범위 (예: '1-2', '3-4')")
    arc_type: ArcType = Field(..., description="3막 구조 분류")
    narrative_stage: str = Field(..., description="서사 단계 및 기능 설명")
    page_turn_strategy: str = Field(..., description="페이지 턴 전략 및 시사점")
    
class Event(BaseModel):
    """이벤트 정보"""
    event_number: int = Field(..., description="이벤트 번호")
    description: str = Field(..., description="이벤트 설명")
    spread_numbers: List[int] = Field(..., description="해당 이벤트가 포함된 스프레드 번호들")
    emotional_tone: str = Field(..., description="감정적 톤 (예: 평온, 긴장, 절망, 희망)")
    visual_key_moments: List[str] = Field(..., description="주요 시각적 순간들")

class Arc(BaseModel):
    """개별 아크 정보"""
    arc_number: int = Field(..., description="아크 번호")
    arc_type: ArcType = Field(..., description="아크 타입")
    description: str = Field(..., description="아크 설명")
    start_spread: int = Field(..., description="시작 스프레드 번호")
    end_spread: int = Field(..., description="종료 스프레드 번호")
    events: List[Event] = Field(..., description="해당 아크에 포함된 이벤트들")
    emotional_arc: str = Field(..., description="감정적 여정")
    key_turning_points: List[str] = Field(..., description="주요 전환점들")

class StoryArcSchema(BaseModel):
    """스토리북 아크 생성 스키마 - 14개 스프레드 구조 기반"""
    
    # 기본 정보
    title: str = Field(..., description="스토리북 제목")
    main_theme: str = Field(..., description="주요 테마")
    target_age: str = Field(..., description="대상 연령")
    
    # 메인 갈등
    main_conflict: str = Field(..., description="주요 갈등 상황")
    conflict_resolution: str = Field(..., description="갈등 해결 방향")
    
    # 14개 스프레드 구조
    spreads: List[Spread] = Field(..., description="14개 스프레드 정보", min_items=14, max_items=14)
    
    # 5개 주요 아크
    arcs: List[Arc] = Field(..., description="5개 주요 아크", min_items=5, max_items=5)
    
    # 10개 핵심 이벤트
    events: List[Event] = Field(..., description="10개 핵심 이벤트", min_items=10, max_items=10)
    
    # 페이지 턴 전략
    page_turn_hooks: List[str] = Field(..., description="각 페이지 턴에서의 갈고리 요소들")
    
    # 시각적 연출 포인트
    visual_highlights: List[str] = Field(..., description="시각적으로 강조할 포인트들")
    
    # 감정적 여정
    emotional_journey: str = Field(..., description="전체적인 감정적 여정 요약")
    
    # 교육적 메시지
    educational_message: Optional[str] = Field(None, description="전달하고자 하는 교육적 메시지")
    
    # 스토리 완성도 검증
    story_coherence: str = Field(..., description="스토리 일관성 및 완성도")
    pacing_analysis: str = Field(..., description="페이싱 분석 및 최적화 포인트")
