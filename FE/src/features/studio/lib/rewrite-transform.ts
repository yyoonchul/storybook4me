import {
  FinalScript,
  FinalScriptSnakeCase,
  RewriteScriptRequest,
  RewriteScriptRequestSnakeCase,
  RewriteScriptResponse,
  RewriteScriptResponseSnakeCase,
} from '../types/rewrite';

export function toSnakeFinalScript(script: FinalScript): FinalScriptSnakeCase {
  return {
    storybook_id: script.storybookId,
    user_id: script.userId,
    spreads: script.spreads.map((spread) => ({
      spread_number: spread.spreadNumber,
      script_1: spread.script1,
      script_2: spread.script2,
    })),
  };
}

export function toSnakeRewriteRequest(
  request: RewriteScriptRequest,
): RewriteScriptRequestSnakeCase {
  return {
    script: toSnakeFinalScript(request.script),
    edit_request: request.editRequest,
  };
}

export function fromSnakeFinalScript(
  script: FinalScriptSnakeCase,
): FinalScript {
  return {
    storybookId: script.storybook_id,
    userId: script.user_id,
    spreads: script.spreads.map((spread) => ({
      spreadNumber: spread.spread_number,
      script1: spread.script_1,
      script2: spread.script_2,
    })),
  };
}

export function fromSnakeRewriteResponse(
  response: RewriteScriptResponseSnakeCase,
): RewriteScriptResponse {
  return {
    script: fromSnakeFinalScript(response.script),
  };
}


