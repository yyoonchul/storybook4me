# 📚 Storybook API Documentation

## 📋 **현재 구현된 API**

### **1. 웨이트리스트 API (Waitlist)**
* **기능:** 서비스 출시 전 사용자들의 관심을 수집하고 알림을 제공합니다.
* **사용 페이지:** `WaitlistPage`, `useWaitlistApi`
* **구현 상태:** ✅ 완료

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/waitlist` | `POST` | 웨이트리스트에 이메일을 등록합니다. | `{ email }` | `{ id, email, message: "Successfully added to waitlist" }` |

---

## 🚀 **향후 구현 예정 API**

### **2. 인증 API (Authentication)**
* **기능:** 사용자의 회원가입, 로그인/로그아웃 등 계정 접근을 관리합니다. (Clerk 사용)
* **사용 페이지:** `AuthModal`, `Header` 컴포넌트
* **구현 상태:** ✅ Clerk 프론트엔드 인증 사용 (백엔드 직접 구현 불필요)

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** | **구현 상태** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | 이메일, 비밀번호로 신규 계정을 생성합니다. | `{ email, password, name }` | `{ user: { id, email, name }, token }` | ❌ Clerk 프론트엔드 처리 |
| `/api/auth/login` | `POST` | 이메일, 비밀번호로 로그인하여 인증 토큰을 발급받습니다. | `{ email, password }` | `{ user: { id, email, name, avatar }, token }` | ❌ Clerk 프론트엔드 처리 |
| `/api/auth/logout` | `POST` | 사용자 세션을 종료하고 로그아웃 처리합니다. | `{ token }` | `{ message: "Logged out successfully" }` | ❌ Clerk 프론트엔드 처리 |
| `/api/auth/social/google` | `GET` | 구글 소셜 로그인을 시작합니다. | - | Redirect to Google OAuth | ❌ Clerk 프론트엔드 처리 |
| `/api/auth/social/apple` | `GET` | 애플 소셜 로그인을 시작합니다. | - | Redirect to Apple OAuth | ❌ Clerk 프론트엔드 처리 |
| `/api/auth/me` | `GET` | 현재 로그인한 사용자 정보를 조회합니다. | `Authorization: Bearer {token}` | `{ user: { id, email, name, avatar } }` | ✅ 구현됨 (Clerk JWT 검증) |

**참고:** Clerk를 사용하므로 회원가입/로그인/로그아웃은 프론트엔드에서 Clerk SDK로 처리됩니다. 백엔드는 JWT 토큰 검증과 사용자 정보 조회만 담당합니다.

---

### **3. 우리가족 API (Characters)**
* **기능:** 우리 서비스의 핵심인 '재사용 가능한 가족 페르소나'를 생성, 조회, 수정, 삭제합니다.
* **사용 페이지:** `FamilyPage`, `CharacterFormPage`, `CharacterModal`, `MainPage`
* **구현 상태:** ❌ 미구현

#### **Request/Response Models**

**Character Model:**
```typescript
interface Character {
  id: string;                    // UUID
  user_id: string;               // Clerk user ID (sub)
  character_name: string;        // 캐릭터 이름
  description?: string;          // 캐릭터 설명
  visual_features?: string;      // 외모 정보 (이미지 생성용)
  image_url?: string;           // 캐릭터 이미지 URL
  personality_traits?: string[]; // 성격 특성 배열
  likes?: string[];             // 취향 배열
  additional_info?: object;      // 추가 정보 (나이, 대명사 등)
  is_preset: boolean;           // 프리셋 캐릭터 여부
  created_at: string;           // ISO 8601 timestamp
  updated_at: string;           // ISO 8601 timestamp
}
```

**Create Character Request:**
```typescript
interface CreateCharacterRequest {
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
```

**Update Character Request:**
```typescript
interface UpdateCharacterRequest {
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
```

**Character List Response:**
```typescript
interface CharacterListResponse {
  characters: Character[];
  total: number;
  page?: number;
  limit?: number;
}
```

**Single Character Response:**
```typescript
interface CharacterResponse {
  character: Character;
}
```

**Preset Characters Response:**
```typescript
interface PresetCharactersResponse {
  presets: Character[];
}
```

**Image Upload Response:**
```typescript
interface ImageUploadResponse {
  image_url: string;
  file_id?: string;
}
```

**Delete Response:**
```typescript
interface DeleteResponse {
  message: string;
  deleted_id: string;
}
```

#### **API Endpoints**

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/family` | `GET` | 현재 로그인한 사용자의 모든 캐릭터 목록을 불러옵니다. | `Authorization: Bearer {token}` | `CharacterListResponse` |
| `/api/family` | `POST` | 새로운 가족 캐릭터를 생성하고 저장합니다. | `CreateCharacterRequest` + `Authorization: Bearer {token}` | `CharacterResponse` |
| `/api/family/{characterId}` | `GET` | 특정 캐릭터의 상세 정보를 불러옵니다. | `Authorization: Bearer {token}` | `CharacterResponse` |
| `/api/family/{characterId}` | `PUT` | 특정 캐릭터의 정보를 수정합니다. | `UpdateCharacterRequest` + `Authorization: Bearer {token}` | `CharacterResponse` |
| `/api/family/{characterId}` | `DELETE` | 특정 캐릭터를 삭제합니다. | `Authorization: Bearer {token}` | `DeleteResponse` |
| `/api/family/presets` | `GET` | 프리셋 캐릭터 목록을 불러옵니다. | - | `PresetCharactersResponse` |
| `/api/family/upload-image` | `POST` | 캐릭터 이미지를 업로드합니다. | `FormData: { image: File }` + `Authorization: Bearer {token}` | `ImageUploadResponse` |

---

### **4. 내 책장 API (My Bookshelf)**
* **기능:** 사용자가 만든 동화책의 생성, 조회, 공개/비공개 설정, 삭제를 처리합니다.
* **사용 페이지:** `MainPage` (My Bookshelf 섹션), `StudioPage`(생성 시작 트리거)
* **DB 기준:** `.cursor/DBTABLES.md`의 `storybooks` 스키마를 따릅니다.

공통 규약
- 인증: 모든 엔드포인트는 `Authorization: Bearer {token}` 헤더 필요
- 시간: ISO 8601 문자열
- ID: UUID

요약 필드(Bookshelf 카드용)
- `id`, `title`, `cover_image_url`(프론트에선 `coverImageUrl`로 매핑), `status`, `is_public`(`isPublic`), `created_at`(`createdAt`), `page_count`(`pageCount`), `like_count`(`likeCount`)

상세 필드(단건 조회 시 확장)
- 위 요약 필드 + `character_ids`, `category`, `tags`, `creation_params`, `updated_at`

엔드포인트

1) 목록 조회

- `GET /api/storybooks`
- Query
  - `page?=number` (기본 1)
  - `limit?=number` (기본 20, 최대 100)
  - `sort?=created_at|like_count` (기본 created_at desc)
  - `order?=asc|desc` (기본 desc)
- Response
```json
{
  "storybooks": [
    {
      "id": "c8f1...",
      "title": "My First Story",
      "coverImageUrl": "https://.../cover.png",
      "status": "pending",
      "isPublic": false,
      "createdAt": "2025-09-25T12:34:56Z",
      "pageCount": 0,
      "likeCount": 0
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

2) 생성 시작 (Studio 생성 트리거를 Bookshelf로 이동)

- `POST /api/storybooks`
- Body
```json
{
  "title": "My First Story",
  "characterIds": ["a6a3..."],
  "theme": "space-adventure",
  "style": "watercolor",
  "pageCount": 10,
  "prompt": "Bedtime story for 6-year-old about stars"
}
```
- 동작: 즉시 `storybooks`에 레코드 생성 (`status: "pending"`, `creation_params`에 요청 파라미터 저장), 백그라운드에서 실제 생성 파이프라인 시작
- Response
```json
{
  "storybook": {
    "id": "c8f1...",
    "title": "My First Story",
    "coverImageUrl": null,
    "status": "pending",
    "isPublic": false,
    "createdAt": "2025-09-25T12:34:56Z",
    "pageCount": 0
  },
  "estimatedTime": 300
}
```

3) 단건 조회

- `GET /api/storybooks/{storybookId}`
- Response
```json
{
  "storybook": {
    "id": "c8f1...",
    "title": "My First Story",
    "coverImageUrl": "https://.../cover.png",
    "status": "script_generated",
    "isPublic": false,
    "createdAt": "2025-09-25T12:34:56Z",
    "updatedAt": "2025-09-25T13:00:00Z",
    "pageCount": 6,
    "likeCount": 2,
    "category": "Fantasy",
    "tags": ["kids", "bedtime"],
    "characterIds": ["a6a3...", "d26d..."],
    "creationParams": {
      "theme": "space-adventure",
      "style": "watercolor",
      "pageCount": 10,
      "prompt": "Bedtime story for 6-year-old about stars"
    }
  }
}
```

4) 공개/비공개 설정

- `PUT /api/storybooks/{storybookId}/visibility`
- Body
```json
{ "isPublic": true }
```
- Response
```json
{ "storybook": { "id": "c8f1...", "isPublic": true } }
```

5) 메타 업데이트(제목 등)

- `PUT /api/storybooks/{storybookId}`
- Body (부분 업데이트)
```json
{ "title": "New Title", "category": "Sci-Fi", "tags": ["ai", "space"] }
```
- Response
```json
{ "storybook": { "id": "c8f1...", "title": "New Title" } }
```

6) 삭제

- `DELETE /api/storybooks/{storybookId}`
- Response
```json
{ "message": "Storybook deleted successfully" }
```

---

### **5. 스튜디오 API (Story Creation & Editing)**
* **기능:** AI와의 상호작용(채팅/재생성)과 페이지 편집 등. 동화책 생성 시작은 Bookshelf API(`POST /api/storybooks`)로 이동했습니다.
* **사용 페이지:** `StudioPage`, `MainPage` (스토리 생성 시작)
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
|  |  |  |  |  |
| `/api/storybooks/{storybookId}` | `GET` | 특정 동화책의 현재 상태와 데이터를 불러옵니다. 프론트엔드에서는 이 API를 주기적으로 호출(Polling)하여 생성 진행 상태(예: `script_generated`, `images_generating`, `complete`)를 확인하고 화면을 업데이트합니다. | `Authorization: Bearer {token}` | `{ storybook: { id, title, status, pages: [{ id, text, imageUrl, characters, background }], progress: 75 } }` |
| `/api/storybooks/{storybookId}` | `PUT` | 사용자가 수정한 동화책 텍스트 내용을 저장합니다. | `{ title?, pages: [{ id, text }] }` | `{ storybook: { id, title, pages } }` |
| `/api/storybooks/{storybookId}/pages/{pageNumber}/regenerate-image` | `POST` | 특정 페이지의 이미지를 다시 생성하도록 요청합니다. | `{ prompt?, style? }` | `{ imageUrl: "https://...", status: "generating" }` |
| `/api/chat/storybook/{storybookId}` | `POST` | AI와 스토리 개선에 대한 대화를 시작합니다. | `{ message, context?: { pageNumber?, currentText? } }` | `{ response: "AI response text", suggestions?: [{ type, content }] }` |

---

### **6. 동화책 뷰어 API (Story Viewer)**
* **기능:** 완성된 동화책을 읽고, 오디오 재생, 공유, 내보내기 기능을 제공합니다. (인증이 필요한 뷰잉과 필요 없는 뷰잉 구분)
* **사용 페이지:** `BookViewerPage`
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/storybooks/{storybookId}` | `GET` | 특정 동화책의 완성된 데이터를 불러옵니다. (뷰어용) | `Authorization: Bearer {token}` | `{ storybook: { id, title, author, pages: [{ id, text, imageUrl }], status: "complete" } }` |
| `/api/storybooks/{storybookId}/audio` | `GET` | 완성된 동화책의 TTS 오디오 파일 URL 목록을 불러옵니다. | `Authorization: Bearer {token}` | `{ audioFiles: [{ pageNumber, audioUrl, duration }] }` |
| `/api/storybooks/{storybookId}/audio` | `POST` | 동화책의 TTS 오디오를 생성합니다. | `{ voice?, speed? }` | `{ status: "generating", estimatedTime: 120 }` |
| `/api/storybooks/{storybookId}/export` | `GET` | 완성된 동화책을 PDF나 컬러링북 파일로 생성하여 다운로드 링크를 제공합니다. | `?format=pdf&quality=high` | `{ downloadUrl: "https://...", expiresAt: "2025-01-01T00:00:00Z" }` |
| `/api/storybooks/{storybookId}/share` | `POST` | 동화책을 공유 가능한 링크로 만듭니다. | `{ isPublic: boolean }` | `{ shareUrl: "https://...", shareId: "abc123" }` |

---

### **7. 커뮤니티 탐색 API (Community & Discovery)**
* **기능:** 사용자들이 만든 공개 동화책을 탐색하고 상호작용할 수 있는 기능을 제공합니다.
* **사용 페이지:** `ExplorePage`, `StoryCard`
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/explore/stories` | `GET` | 공개된 동화책 목록을 검색, 필터링, 정렬하여 조회합니다. (isPublic=true인 동화책만) | `?q=search&category=fantasy&sort=latest&page=1&limit=20` | `{ stories: [{ id, title, author, coverUrl, category, tags, likes, views, createdAt, isPublic: true }], pagination: { page, total, hasNext } }` |
| `/api/explore/categories` | `GET` | 사용 가능한 카테고리 목록을 조회합니다. | - | `{ categories: [{ id, name, count }] }` |
| `/api/explore/trending` | `GET` | 인기 있는 동화책 목록을 조회합니다. | `?period=week&limit=10` | `{ stories: [{ id, title, author, coverUrl, likes, views }] }` |
| `/api/stories/{storyId}/like` | `POST` | 동화책에 좋아요를 추가/제거합니다. | `Authorization: Bearer {token}` | `{ liked: boolean, likeCount: number }` |
| `/api/stories/{storyId}/view` | `POST` | 동화책 조회수를 증가시킵니다. | - | `{ viewCount: number }` |

---

### **8. 계정 및 구독 API (Account & Subscription)**
* **기능:** 사용자의 개인 정보와 구독 플랜을 관리합니다. (크레딧 조회 추가)
* **사용 페이지:** `AccountPage`, `BillingPage`
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/account` | `GET` | 현재 로그인한 사용자의 계정 정보(이메일 등)를 불러옵니다. | `Authorization: Bearer {token}` | `{ user: { id, email, name, avatar, providers, createdAt } }` |
| `/api/account` | `PUT` | 사용자 계정 정보를 수정합니다. | `{ name?, email?, avatar? }` | `{ user: { id, email, name, avatar } }` |
| `/api/account/password` | `PUT` | 사용자 비밀번호를 변경합니다. | `{ currentPassword, newPassword }` | `{ message: "Password updated successfully" }` |
| `/api/account/delete` | `DELETE` | 사용자 계정을 영구 삭제합니다. | `{ password }` | `{ message: "Account deleted successfully" }` |
| **`/api/account/usage`** | **`GET`** | **현재 사용자의 크레딧 및 사용량(생성한 책 개수 등)을 조회합니다.** | **`Authorization: Bearer {token}`** | **`{ usage: { storybooks: { used: 3, limit: 10 }, imageRegens: { used: 5, limit: 20 } } }`** |
| `/api/subscription` | `GET` | 현재 구독 상태(플랜 종류, 만료일 등)를 불러옵니다. | `Authorization: Bearer {token}` | `{ subscription: { planId, status, renewsOn, paymentMethod, features } }` |
| `/api/subscription/plans` | `GET` | 사용 가능한 구독 플랜 목록을 조회합니다. | - | `{ plans: [{ id, name, price, features, limits }] }` |
| `/api/subscription/upgrade` | `POST` | 구독 플랜을 업그레이드합니다. | `{ planId, paymentMethodId }` | `{ subscription: { planId, status, renewsOn } }` |
| `/api/subscription/manage` | `POST` | Stripe 등 외부 결제 서비스의 고객 포털로 이동하는 세션 링크를 생성하여, 사용자가 직접 결제 정보를 관리하도록 합니다. | `Authorization: Bearer {token}` | `{ portalUrl: "https://..." }` |
| `/api/subscription/cancel` | `POST` | 구독을 취소합니다. | `Authorization: Bearer {token}` | `{ subscription: { status: "canceled", endsOn: "2025-01-01" } }` |
| `/api/billing/invoices` | `GET` | 사용자의 청구서 목록을 조회합니다. | `Authorization: Bearer {token}` | `{ invoices: [{ id, amount, status, createdAt, downloadUrl }] }` |

---

### **9. 파일 업로드 API (File Upload)**
* **기능:** 이미지, 오디오 등 다양한 미디어 파일을 업로드하고 관리합니다.
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/upload/image` | `POST` | 이미지 파일을 업로드합니다. | `FormData: { file: File, type?: "character" \| "story" }` | `{ url: "https://...", id: "file_id" }` |
| `/api/upload/delete/{fileId}` | `DELETE` | 업로드된 파일을 삭제합니다. | `Authorization: Bearer {token}` | `{ message: "File deleted successfully" }` |

---

### **10. 시스템 상태 API (System Status)**
* **기능:** 서비스 상태, 유지보수 정보 등을 제공합니다.
* **구현 상태:** ❌ 미구현

| **Endpoint** | **Method** | **설명** | **Request Body** | **Response** |
| :--- | :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | 서비스 상태를 확인합니다. | - | `{ status: "healthy", timestamp: "2025-01-01T00:00:00Z" }` |
| `/api/status` | `GET` | 서비스 상태와 알림을 조회합니다. | - | `{ status: "operational", maintenance?: { scheduled: "2025-01-01T02:00:00Z" } }` |

---

## 📖 **API 사용 가이드라인**

### **🔐 인증 방식**
- JWT 토큰을 사용한 Bearer 인증 (구현 예정)
- `Authorization: Bearer {token}` 헤더로 전송
- 토큰 만료 시 401 응답과 함께 새 토큰 발급 필요

### **⚠️ 에러 처리**
- 표준 HTTP 상태 코드 사용
- 에러 응답 형식: `{ error: { code: string, message: string, details?: any } }`
- 4xx: 클라이언트 오류, 5xx: 서버 오류

### **📄 페이지네이션**
- 쿼리 파라미터: `?page=1&limit=20`
- 응답 형식: `{ data: [], pagination: { page: 1, total: 100, hasNext: true } }`

### **📁 파일 업로드**
- `multipart/form-data` 형식 사용
- 최대 파일 크기: 이미지 10MB, 오디오 50MB
- 지원 형식: 이미지 (JPG, PNG, WebP), 오디오 (MP3, WAV)

---