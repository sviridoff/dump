import { AppError } from '../libs/Error.js';
import {
  ResultSuccess,
  ResultFailure,
} from '../libs/Result.js';

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
  ResultSuccess<AppReplyConfig> | ResultFailure<AppError>
>;

export interface AppController {
  handler(request: AppRequest): AppReply;
}
