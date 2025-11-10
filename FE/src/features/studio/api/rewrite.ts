import { apiClient } from '@/shared/lib/api-client';

import {
  RewriteScriptRequest,
  RewriteScriptResponse,
  RewriteScriptResponseSnakeCase,
} from '../types/rewrite';
import {
  fromSnakeRewriteResponse,
  toSnakeRewriteRequest,
} from '../lib/rewrite-transform';

const ENDPOINT = '/studio/storybooks/rewrite';

export async function rewriteStorybookScript(
  payload: RewriteScriptRequest,
  token?: string,
): Promise<RewriteScriptResponse> {
  const snakePayload = toSnakeRewriteRequest(payload);
  const response =
    await apiClient.post<RewriteScriptResponseSnakeCase>(
      ENDPOINT,
      snakePayload,
      token,
    );
  return fromSnakeRewriteResponse(response);
}


