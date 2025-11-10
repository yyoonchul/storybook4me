export type SpreadScript = {
  spreadNumber: number;
  script1: string;
  script2: string;
};

export type FinalScript = {
  storybookId: string;
  userId: string;
  spreads: SpreadScript[];
};

export type RewriteScriptRequest = {
  script: FinalScript;
  editRequest: string;
};

export type RewriteScriptResponse = {
  script: FinalScript;
};

export type FinalScriptSnakeCase = {
  storybook_id: string;
  user_id: string;
  spreads: Array<{
    spread_number: number;
    script_1: string;
    script_2: string;
  }>;
};

export type RewriteScriptRequestSnakeCase = {
  script: FinalScriptSnakeCase;
  edit_request: string;
};

export type RewriteScriptResponseSnakeCase = {
  script: FinalScriptSnakeCase;
};


