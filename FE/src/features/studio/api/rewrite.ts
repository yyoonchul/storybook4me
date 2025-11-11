import { apiClient } from '@/shared/lib/api-client';

import {
  ChatRequest,
  ChatResponse,
  ChatResponseSnakeCase,
  RewriteScriptRequest,
  RewriteScriptResponse,
  RewriteScriptResponseSnakeCase,
} from '../types/rewrite';
import {
  fromSnakeChatResponse,
  fromSnakeRewriteResponse,
  toSnakeChatRequest,
  toSnakeRewriteRequest,
} from '../lib/rewrite-transform';

const REWRITE_ENDPOINT = '/studio/storybooks/rewrite';
const CHAT_ENDPOINT = '/studio/storybooks/chat';

export async function rewriteStorybookScript(
  payload: RewriteScriptRequest,
  token?: string,
): Promise<RewriteScriptResponse> {
  const snakePayload = toSnakeRewriteRequest(payload);
  const response =
    await apiClient.post<RewriteScriptResponseSnakeCase>(
      REWRITE_ENDPOINT,
      snakePayload,
      token,
    );
  return fromSnakeRewriteResponse(response);
}

export async function postStudioChat(
  payload: ChatRequest,
  token?: string,
): Promise<ChatResponse> {
  const snakePayload = toSnakeChatRequest(payload);
  const response = await apiClient.post<ChatResponseSnakeCase>(
    CHAT_ENDPOINT,
    snakePayload,
    token,
  );
  return fromSnakeChatResponse(response);
}


