<!-- e2aa121f-5ad8-4239-a0f5-05ca7dabbd8b 878818cd-61ea-4655-9331-72f73f8f3312 -->
# 페이지별 캐릭터 선택 시 본문 생성 워크플로 통합 계획

## 현재 상황 분석

1. **캐릭터 저장 위치**:

   - Storybook 레벨: `creation_params.character_ids` (bible 생성 시 사용)
   - Page 레벨: `pages.character_ids` (현재 본문 생성에 미사용)

2. **본문 생성 흐름**:

   - `draft.py`: Storybook 전체 본문 생성 (storybook 레벨 bible 사용)
   - `rewrite.py`: 본문 수정 (현재 페이지별 캐릭터 정보 미사용)

3. **문제점**:

   - 페이지별로 선택한 캐릭터가 본문 생성/재생성 시 반영되지 않음

## 구현 계획

### 1. 페이지별 캐릭터 정보 조회 유틸리티 생성

**파일**: `BE/app/features/studio/storybook_generator/services/utils.py` (신규)

- `get_characters_for_page(page_id: str, storybook_id: str) -> List[Character]` 함수 생성
- 페이지의 `character_ids`를 조회
- `character_ids`가 있으면 characters 테이블에서 조회하여 반환
- 없으면 storybook 레벨 bible의 characters 반환 (fallback)
- 캐릭터 정보를 `Character` 모델로 변환하여 반환

### 2. Draft 생성 시 페이지별 캐릭터 정보 활용

**파일**: `BE/app/features/studio/storybook_generator/services/draft.py`

- `generate_final_script()` 함수 수정
- 각 페이지별로 캐릭터 정보를 조회하는 로직 추가
- Story bible 텍스트 생성 시:
  - Storybook 레벨 bible의 기본 캐릭터 정보 포함
  - 각 스프레드(페이지 쌍)별로 페이지 캐릭터 정보 추가 컨텍스트로 포함
- 페이지별 캐릭터 정보가 있으면 우선 사용, 없으면 storybook 레벨 사용

### 3. Rewrite 시 페이지별 캐릭터 정보 활용

**파일**: `BE/app/features/studio/storybook_generator/services/rewrite.py`

- `rewrite_plain_text()` 함수 수정
  - 페이지 ID와 storybook ID를 추가 파라미터로 받도록 변경 (선택적)
  - 페이지별 캐릭터 정보를 조회하여 프롬프트에 포함
- `rewrite_full_script_with_summary()` 함수 수정
  - 각 스프레드별 페이지에 해당하는 캐릭터 정보를 조회
  - 스프레드별 캐릭터 정보를 프롬프트에 포함

### 4. 페이지별 캐릭터 정보를 Bible 스키마에 반영하는 함수

**파일**: `BE/app/features/studio/storybook_generator/services/bible.py` (기존 확장 또는 utils에 추가)

- `enrich_bible_with_page_characters(storybook_id: str, bible: StoryBibleSchema) -> StoryBibleSchema` 함수 생성
- 각 페이지의 `character_ids`를 조회하여 bible의 characters 리스트에 병합
- 중복 캐릭터는 제거 (character_name 기준)
- 페이지별 캐릭터가 있으면 해당 정보를 bible에 반영

### 5. API 엔드포인트 수정 (필요시)

**파일**: `BE/app/features/studio/api/data.py`

- `update_page_content()` API 호출 시 `character_ids` 업데이트 감지
- 선택적: `character_ids` 변경 시 자동으로 해당 페이지 본문 재생성 옵션 (향후 확장)

### 6. 프롬프트 템플릿 수정

**파일**: `BE/app/features/studio/storybook_generator/prompts/draft.md`

- 페이지별 캐릭터 정보를 포함할 수 있는 플레이스홀더 추가
- 예: `{{page_specific_characters}}` (스프레드별로 다를 수 있음)

## 구현 세부사항

### Character 조회 로직

```python
def get_characters_for_page(page_id: str, storybook_id: str) -> List[Character]:
    # 1. 페이지의 character_ids 조회
    # 2. character_ids가 있으면 characters 테이블에서 조회
    # 3. 없으면 storybook의 creation_params.bible.characters 반환
    # 4. Character 모델로 변환하여 반환
```

### Bible 캐릭터 정보 우선순위

1. 페이지별 `character_ids` → characters 테이블 조회
2. Fallback: storybook 레벨 bible의 characters
3. Fallback: bible에 characters가 없으면 빈 리스트

### Draft 생성 시 캐릭터 정보 활용

- Story bible 텍스트에 기본 캐릭터 정보 포함
- 각 스프레드 생성 시 해당 스프레드의 페이지 캐릭터 정보를 추가 컨텍스트로 제공
- LLM이 페이지별 캐릭터 정보를 고려하여 해당 페이지의 본문 생성

## 테스트 케이스

1. 페이지에 캐릭터가 선택된 경우: 선택한 캐릭터 정보가 본문에 반영
2. 페이지에 캐릭터가 선택되지 않은 경우: storybook 레벨 캐릭터 정보 사용
3. 일부 페이지만 캐릭터가 선택된 경우: 선택된 페이지만 해당 캐릭터 사용
4. 캐릭터가 전혀 없는 경우: 기본 동작 유지

### To-dos

- [ ] 페이지별 캐릭터 정보를 조회하는 유틸리티 함수 생성 (get_characters_for_page)
- [ ] draft.py의 generate_final_script() 함수 수정하여 페이지별 캐릭터 정보를 활용하도록 변경
- [ ] rewrite.py의 rewrite_plain_text()와 rewrite_full_script_with_summary() 함수 수정하여 페이지별 캐릭터 정보 활용
- [ ] bible.py에 페이지별 캐릭터 정보를 bible 스키마에 반영하는 함수 추가
- [ ] draft.md 프롬프트 템플릿 수정하여 페이지별 캐릭터 정보를 포함할 수 있도록 업데이트