import { ResultOK, ResultFail } from '@daisugi/kintsugi';

import { AppError } from './AppError.js';

export interface AppRequest {
  params: Record<string, any>;
  body: Record<string, any>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

interface AppReplyConfig {
  templatePath?: string;
  templateData?: Record<string, any>;
  redirectToURL?: string;
}

export type AppReply = Promise<
  ResultOK<AppReplyConfig> | ResultFail<AppError>
>;

export interface AppController {
  handler(request: AppRequest): AppReply;
}
