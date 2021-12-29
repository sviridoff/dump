import { ResultOK, ResultFail } from '@daisugi/kintsugi';

import { ServiceError } from './ServiceError';

export interface ServiceRequest {
  params: Record<string, any>;
}

interface ServiceReplyConfig {
  templatePath: string;
  templateData: Record<string, any>;
}

export type ServiceReply = Promise<
  ResultOK<ServiceReplyConfig> | ResultFail<ServiceError>
>;

export interface ServiceController {
  handler(request: ServiceRequest): ServiceReply;
}
