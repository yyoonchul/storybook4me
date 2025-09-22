# 📊 **Storybook 데이터베이스 스키마 (Supabase / PostgreSQL)**

## 🎯 **핵심 설계 원칙**

1. **관계형 데이터 모델:** 사용자, 캐릭터, 스토리북, 페이지 간의 명확한 관계를 Foreign Key로 설정하여 데이터의 무결성을 보장합니다.
2. **Supabase 인증 연동:** Supabase의 내장 `auth.users` 테이블을 모든 데이터의 주인(Owner)으로 삼아, 모든 테이블을 RLS로 보호합니다.
3. **확장성 및 유연성:** `JSONB`, `TEXT[]` 등 PostgreSQL의 유연한 데이터 타입을 활용하여 향후 기능 확장을 용이하게 합니다.

## 🏗️ **전체 스키마 구조도**

```
[auth.users] 1--1 [profiles] 1--N [characters]
      |              |
      |              `--1--N [storybooks] 1--N [pages]
      |              |              |
      |              |              `--1--N [storybook_likes]
      |              |
      |              `--1--N [waitlist]
      |
      `--1--1 (via profiles) [subscriptions]
```

---

## 📋 **테이블 스키마**

### **1. `profiles` - 사용자 프로필 테이블 (Clerk 단일 인증 기준)**

> **📝 설명:** Supabase의 인증 시스템(`auth.users`)과 직접 연결되는 테이블입니다. 앱 내에서 필요한 사용자 추가 정보와 다른 모든 데이터의 소유권을 관리하는 **가장 중요한 허브 테이블**입니다.

> **🔒 RLS 정책:** 사용자는 자신의 프로필만 보고 수정할 수 있습니다. Clerk 토큰의 `sub`를 사용합니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `TEXT` | `PRIMARY KEY` | Clerk User ID (JWT `sub`) |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | 마지막 수정 시간 |
| `full_name` | `TEXT` | - | 사용자 이름 |
| `avatar_url` | `TEXT` | - | 프로필 이미지 URL |
| `email` | `TEXT` | - | 이메일 (auth.users에서 복사) |
| `credits_used` | `INTEGER` | `DEFAULT 0` | 사용한 크레딧 수 |
| `storybooks_created` | `INTEGER` | `DEFAULT 0` | 생성한 동화책 수 |
| `image_regenerations` | `INTEGER` | `DEFAULT 0` | 이미지 재생성 횟수 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (Clerk JWT sub 사용)
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (id = auth.jwt()->>'sub');
```


---

### **2. `characters` - 가족 캐릭터 테이블**

> **📝 설명:** 사용자가 생성하고 관리하는 '재사용 가능한 가족 페르소나' 정보를 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신이 생성한 캐릭터만 CRUD 할 수 있습니다. 프리셋 캐릭터는 모든 사용자가 조회 가능합니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 캐릭터 고유 ID |
| `user_id` | `TEXT` | `NOT NULL`, `REFERENCES profiles(id)` | 소유자 ID (Clerk sub) |
| `character_name` | `TEXT` | `NOT NULL` | 캐릭터 이름 |
| `description` | `TEXT` | - | 캐릭터 설명 |
| `visual_features` | `TEXT` | - | 외모 정보 (이미지 생성용) |
| `image_url` | `TEXT` | - | 캐릭터 이미지 URL |
| `personality_traits` | `TEXT[]` | - | 성격 특성 배열 |
| `likes` | `TEXT[]` | - | 취향 배열 |
| `additional_info` | `JSONB` | - | 추가 정보 (나이, 대명사 등) |
| `is_preset` | `BOOLEAN` | `DEFAULT FALSE` | 프리셋 캐릭터 여부 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 수정 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- 정책 생성
-- 1. 조회: 자신의 캐릭터 + 프리셋 캐릭터
CREATE POLICY "Users can view own and preset characters" 
  ON public.characters FOR SELECT 
  USING (user_id = auth.jwt()->>'sub' OR is_preset = true);

-- 2. 삽입: 자신의 캐릭터만 (프리셋은 시스템에서만 생성)
CREATE POLICY "Users can insert own characters" 
  ON public.characters FOR INSERT 
  WITH CHECK (user_id = auth.jwt()->>'sub');

-- 3. 수정: 자신의 캐릭터만 (프리셋은 수정 불가)
CREATE POLICY "Users can update own characters" 
  ON public.characters FOR UPDATE 
  USING (user_id = auth.jwt()->>'sub');

-- 4. 삭제: 자신의 캐릭터만 (프리셋은 삭제 불가)
CREATE POLICY "Users can delete own characters" 
  ON public.characters FOR DELETE 
  USING (user_id = auth.jwt()->>'sub');
```

---

### **3. `storybooks` - 동화책 정보 테이블**

> **📝 설명:** 생성된 동화책의 메타데이터(제목, 표지, 상태 등)를 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신이 생성한 동화책만 CRUD 할 수 있습니다. 공개된 동화책은 모든 사용자가 조회할 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 동화책 고유 ID |
| `user_id` | `TEXT` | `NOT NULL`, `REFERENCES profiles(id)` | 소유자 ID (Clerk sub) |
| `title` | `TEXT` | - | 동화책 제목 |
| `cover_image_url` | `TEXT` | - | 표지 이미지 URL |
| `is_public` | `BOOLEAN` | `DEFAULT FALSE` | 공개 여부 (Explore 페이지 표시) |
| `status` | `VARCHAR(50)` | `NOT NULL`, `DEFAULT 'pending'` | 생성 상태 |
| `creation_params` | `JSONB` | - | 생성 시 사용된 파라미터 |
| `page_count` | `INTEGER` | `DEFAULT 0` | 페이지 수 |
| `view_count` | `INTEGER` | `DEFAULT 0` | 조회수 |
| `like_count` | `INTEGER` | `DEFAULT 0` | 좋아요 수 |
| `category` | `VARCHAR(50)` | - | 카테고리 (Sci-Fi, Fantasy 등) |
| `tags` | `TEXT[]` | - | 태그 배열 |
| `character_ids` | `UUID[]` | - | 사용된 캐릭터 ID 배열 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 수정 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.storybooks ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can view own storybooks" 
  ON public.storybooks FOR SELECT 
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can view public storybooks" 
  ON public.storybooks FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can insert own storybooks" 
  ON public.storybooks FOR INSERT 
  WITH CHECK (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own storybooks" 
  ON public.storybooks FOR UPDATE 
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can delete own storybooks" 
  ON public.storybooks FOR DELETE 
  USING (user_id = auth.jwt()->>'sub');
```
---

### **4. `pages` - 동화책 페이지 테이블**

> **📝 설명:** 특정 동화책에 속한 각 페이지의 글, 이미지, 오디오 정보를 저장합니다.

> **🔒 RLS 정책:** 이 테이블은 `storybooks` 테이블에 종속되므로, 사용자가 소유한 `storybook`의 `page`만 볼 수 있도록 RLS를 설정합니다. 공개된 동화책의 페이지는 모든 사용자가 조회할 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 페이지 고유 ID |
| `storybook_id` | `UUID` | `NOT NULL`, `REFERENCES storybooks(id)` | 소속 동화책 ID |
| `page_number` | `INT` | `NOT NULL` | 페이지 번호 |
| `script_text` | `TEXT` | - | 페이지 텍스트 내용 |
| `image_url` | `TEXT` | - | 페이지 이미지 URL |
| `audio_url` | `TEXT` | - | TTS 오디오 URL |
| `image_prompt` | `TEXT` | - | 이미지 생성 프롬프트 |
| `image_style` | `VARCHAR(50)` | - | 이미지 스타일 |
| `character_ids` | `UUID[]` | - | 페이지에 등장하는 캐릭터 ID 배열 |
| `background_description` | `TEXT` | - | 배경 설명 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can view pages of own storybooks" 
  ON public.pages FOR SELECT 
  USING (storybook_id IN (
    SELECT id FROM public.storybooks WHERE user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can view pages of public storybooks" 
  ON public.pages FOR SELECT 
  USING (storybook_id IN (
    SELECT id FROM public.storybooks WHERE is_public = true
  ));

CREATE POLICY "Users can insert pages to own storybooks" 
  ON public.pages FOR INSERT 
  WITH CHECK (storybook_id IN (
    SELECT id FROM public.storybooks WHERE user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can update pages of own storybooks" 
  ON public.pages FOR UPDATE 
  USING (storybook_id IN (
    SELECT id FROM public.storybooks WHERE user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can delete pages of own storybooks" 
  ON public.pages FOR DELETE 
  USING (storybook_id IN (
    SELECT id FROM public.storybooks WHERE user_id = auth.jwt()->>'sub'
  ));
```

---

### **5. `storybook_likes` - 동화책 좋아요 테이블**

> **📝 설명:** 사용자가 동화책에 좋아요를 누른 기록을 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신의 좋아요만 관리할 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 좋아요 고유 ID |
| `user_id` | `TEXT` | `NOT NULL`, `REFERENCES profiles(id)` | 사용자 ID (Clerk sub) |
| `storybook_id` | `UUID` | `NOT NULL`, `REFERENCES storybooks(id)` | 동화책 ID |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.storybook_likes ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can manage own likes" 
  ON public.storybook_likes FOR ALL 
  USING (user_id = auth.jwt()->>'sub');
```

---

### **6. `subscriptions` - 구독 정보 테이블**

> **📝 설명:** 사용자의 구독 상태와 결제 정보를 관리합니다. Stripe과 같은 외부 결제 서비스와 연동하는 것을 전제로 설계합니다.

> **🔒 RLS 정책:** 사용자는 자신의 구독 정보만 볼 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 구독 고유 ID |
| `user_id` | `TEXT` | `UNIQUE`, `NOT NULL`, `REFERENCES profiles(id)` | 사용자 ID (Clerk sub, 1:1) |
| `stripe_customer_id` | `TEXT` | `UNIQUE` | Stripe 고객 ID |
| `stripe_subscription_id` | `TEXT` | `UNIQUE` | Stripe 구독 ID |
| `status` | `VARCHAR(50)` | - | 구독 상태 (trialing, active, canceled, past_due) |
| `plan_type` | `VARCHAR(50)` | - | 플랜 타입 (monthly, annual, free) |
| `current_period_start` | `TIMESTAMPTZ` | - | 현재 구독 시작일 |
| `current_period_end` | `TIMESTAMPTZ` | - | 현재 구독 종료일 |
| `credits_included` | `INTEGER` | `DEFAULT 0` | 구독에 포함된 크레딧 |
| `credits_used` | `INTEGER` | `DEFAULT 0` | 사용한 크레딧 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 수정 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions FOR SELECT 
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own subscription" 
  ON public.subscriptions FOR UPDATE 
  USING (user_id = auth.jwt()->>'sub');
```

---

### **7. `waitlist` - 웨이트리스트 테이블**

> **📝 설명:** 서비스 출시 전 사용자들의 관심을 수집합니다.

> **🔒 RLS 정책:** 모든 사용자가 등록할 수 있지만, 자신의 등록 정보만 조회할 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 웨이트리스트 고유 ID |
| `email` | `TEXT` | `UNIQUE`, `NOT NULL` | 이메일 주소 |

---

### **8. `chat_sessions` - AI 채팅 세션 테이블**

> **📝 설명:** 스튜디오에서 AI와의 채팅 기록을 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신의 채팅 세션만 볼 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 세션 고유 ID |
| `user_id` | `TEXT` | `NOT NULL`, `REFERENCES profiles(id)` | 사용자 ID (Clerk sub) |
| `storybook_id` | `UUID` | `REFERENCES storybooks(id)`, `ON DELETE CASCADE` | 동화책 ID (NULL 허용) |
| `session_name` | `TEXT` | - | 세션 이름 |
| `context` | `JSONB` | - | 채팅 컨텍스트 (현재 페이지, 스토리 정보 등) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 수정 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can manage own chat sessions" 
  ON public.chat_sessions FOR ALL 
  USING (user_id = auth.jwt()->>'sub');
```

---

### **9. `chat_messages` - AI 채팅 메시지 테이블**

> **📝 설명:** 채팅 세션의 개별 메시지들을 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신의 채팅 메시지만 볼 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 메시지 고유 ID |
| `session_id` | `UUID` | `NOT NULL`, `REFERENCES chat_sessions(id)` | 채팅 세션 ID |
| `user_id` | `TEXT` | `NOT NULL`, `REFERENCES profiles(id)` | 사용자 ID (Clerk sub) |
| `role` | `VARCHAR(20)` | `NOT NULL` | 메시지 역할 (user, assistant, system) |
| `content` | `TEXT` | `NOT NULL` | 메시지 내용 |
| `suggestions` | `JSONB` | - | AI 제안사항 |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can manage own chat messages" 
  ON public.chat_messages FOR ALL 
  USING (user_id = auth.jwt()->>'sub');
```

---

### **10. `file_uploads` - 파일 업로드 테이블**

> **📝 설명:** 업로드된 파일들의 메타데이터를 저장합니다.

> **🔒 RLS 정책:** 사용자는 자신이 업로드한 파일만 관리할 수 있습니다.

#### **📋 테이블 스키마**

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | 파일 고유 ID |
| `user_id` | `UUID` | `NOT NULL`, `REFERENCES profiles(id)` | 사용자 ID |
| `file_name` | `TEXT` | `NOT NULL` | 파일명 |
| `file_size` | `INTEGER` | `NOT NULL` | 파일 크기 (바이트) |
| `file_type` | `VARCHAR(50)` | `NOT NULL` | 파일 타입 (image, audio, document) |
| `mime_type` | `TEXT` | `NOT NULL` | MIME 타입 (image/jpeg, audio/mp3 등) |
| `file_url` | `TEXT` | `NOT NULL` | Supabase Storage URL |
| `category` | `VARCHAR(50)` | - | 파일 분류 (character, story, avatar 등) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | 생성 시간 |

#### **🔐 RLS 정책**

```sql
-- RLS 활성화
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can manage own file uploads" 
  ON public.file_uploads FOR ALL 
  USING (auth.uid() = user_id);
```

---

## 🔧 **인덱스 및 최적화**

### **📊 성능 최적화를 위한 인덱스**

#### **동화책 관련 인덱스**
```sql
-- 사용자별 동화책 조회 최적화
CREATE INDEX idx_storybooks_user_id ON public.storybooks(user_id);

-- 공개 동화책 조회 최적화
CREATE INDEX idx_storybooks_public ON public.storybooks(is_public) WHERE is_public = true;

-- 카테고리별 조회 최적화
CREATE INDEX idx_storybooks_category ON public.storybooks(category);

-- 최신순 정렬 최적화
CREATE INDEX idx_storybooks_created_at ON public.storybooks(created_at DESC);

-- 인기순 정렬 최적화
CREATE INDEX idx_storybooks_like_count ON public.storybooks(like_count DESC);

-- 동화책별 캐릭터 조회 최적화
CREATE INDEX idx_storybooks_character_ids ON public.storybooks USING GIN (character_ids);
```

#### **페이지 관련 인덱스**
```sql
-- 동화책별 페이지 조회 최적화
CREATE INDEX idx_pages_storybook_id ON public.pages(storybook_id);

-- 페이지 번호 정렬 최적화
CREATE INDEX idx_pages_page_number ON public.pages(storybook_id, page_number);

-- 페이지별 캐릭터 조회 최적화
CREATE INDEX idx_pages_character_ids ON public.pages USING GIN (character_ids);
```

#### **캐릭터 관련 인덱스**
```sql
-- 사용자별 캐릭터 조회 최적화
CREATE INDEX idx_characters_user_id ON public.characters(user_id);

-- 프리셋 캐릭터 조회 최적화
CREATE INDEX idx_characters_preset ON public.characters(is_preset) WHERE is_preset = true;
```

#### **좋아요 관련 인덱스**
```sql
-- 동화책별 좋아요 조회 최적화
CREATE INDEX idx_storybook_likes_storybook_id ON public.storybook_likes(storybook_id);

-- 사용자별 좋아요 조회 최적화
CREATE INDEX idx_storybook_likes_user_id ON public.storybook_likes(user_id);

```

#### **채팅 관련 인덱스**
```sql
-- 사용자별 채팅 세션 조회 최적화
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);

-- 세션별 메시지 조회 최적화
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
```

---

## 📊 **통계 및 분석을 위한 뷰**

### **🔥 인기 동화책 뷰**

> **📝 설명:** 공개된 동화책을 좋아요 수와 조회수 기준으로 정렬한 뷰입니다.

```sql
CREATE VIEW popular_storybooks AS
SELECT 
  s.*,
  p.full_name as author_name,
  COALESCE(like_count, 0) as total_likes,
  COALESCE(view_count, 0) as total_views
FROM public.storybooks s
LEFT JOIN public.profiles p ON s.user_id = p.id
WHERE s.is_public = true
ORDER BY COALESCE(like_count, 0) DESC, COALESCE(view_count, 0) DESC;
```

### **👤 사용자 통계 뷰**

> **📝 설명:** 사용자별 생성한 동화책 수, 캐릭터 수, 크레딧 사용량 등의 통계를 제공하는 뷰입니다.

```sql
CREATE VIEW user_stats AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  COUNT(DISTINCT s.id) as storybooks_created,
  COUNT(DISTINCT c.id) as characters_created,
  p.credits_used,
  p.storybooks_created as total_storybooks,
  p.image_regenerations
FROM public.profiles p
LEFT JOIN public.storybooks s ON p.id = s.user_id
LEFT JOIN public.characters c ON p.id = c.user_id
GROUP BY p.id, p.full_name, p.email, p.credits_used, p.storybooks_created, p.image_regenerations;
```

---