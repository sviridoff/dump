import { ResultOK, ResultFail } from '@daisugi/kintsugi';

import { ServiceError } from './ServiceError.js';

export interface ServiceRequest {
  params: Record<string, any>;
  body: Record<string, any>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

interface ServiceReplyConfig {
  templatePath?: string;
  templateData?: Record<string, any>;
  redirectURL?: string;
}

export type ServiceReply = Promise<
  ResultOK<ServiceReplyConfig> | ResultFail<ServiceError>
>;

export interface ServiceController {
  handler(request: ServiceRequest): ServiceReply;
}
