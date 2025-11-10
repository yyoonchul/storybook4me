# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/96c0bd8c-b5db-4dea-b69c-f0b2ae17022d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/96c0bd8c-b5db-4dea-b69c-f0b2ae17022d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/96c0bd8c-b5db-4dea-b69c-f0b2ae17022d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Studio Rewrite Flow

- `StudioPage`의 채팅 입력은 `rewriteStorybookScript` API를 호출해 전체 14스프레드 스크립트를 재작성합니다.
- 현재 `storybook.pages`를 정렬해 28개의 페이지를 왼쪽/오른쪽 쌍으로 묶고, 편집 중인 페이지의 임시 텍스트(`usePageText`)를 그대로 반영하여 `FinalScript` 타입으로 변환합니다.
- 성공 시 `applyRewriteResult`가 실행되어 `storybook` 상태와 현재 페이지 텍스트를 업데이트하며, 프리뷰에서 바로 결과를 확인할 수 있습니다. (다른 페이지는 다음 자동 저장 사이클에서 동기화됩니다.)
- 오류(페이지 수 부족 등)가 발생하면 토스트 + 챗봇 메시지로 사용자에게 안내합니다.
