# Project Architecture Overview (Simplified)

## 1. Guiding Principles

This project follows a **Decoupled Architecture** that completely separates the React SPA (Single Page Application) frontend from the FastAPI backend. This enables independent development, deployment, and scaling of each domain. All infrastructure utilizes managed platforms such as Vercel, Railway, Supabase, and Clerk to minimize development and infrastructure management costs.

-   **Frontend (UI/UX):** Handled by a React app deployed on Vercel, with authentication processed through Clerk components.
-   **Backend (Business Logic):** A Python-based FastAPI server deployed on Railway handles all business logic and AI integration.
-   **Data Layer:** Supabase exclusively handles the roles of PostgreSQL database and file storage.
-   **Authentication:** Clerk manages user session management, social login, and all authentication processes.

---

## 2. Technology Stack

### Frontend

-   **Framework/Library:** React (Vite)
-   **Language:** TypeScript
-   **UI Components:** shadcn/ui, Tailwind CSS
-   **Deployment:** Vercel

### Backend

-   **Framework:** FastAPI
-   **Language:** Python
-   **Deployment:** Railway

### Authentication

-   **Service:** Clerk

### Database & Services

-   **Platform:** Supabase
-   **Database:** PostgreSQL
-   **Storage:** Supabase Storage (for storing images and audio files)

---

## 3. System Architecture & Data Flow

### Architecture Diagram

[User's Browser] <--> [Vercel (Frontend)] <--> [Railway (Backend)]
       ^  |                        |
       |  |                        |--- [External AI APIs]
       |  |                        |--- [Supabase (DB, Storage)]
       |  v                        |
       `---- [Clerk (Auth)] <------`