import { ResultOK } from '@daisugi/kintsugi';

export interface ServiceRequest {
  params: Record<string, any>;
}

export interface ServiceReply {
  templatePath: string;
  templateData: Record<string, any>;
}

export interface ServiceController {
  handler(
    request: ServiceRequest,
  ): Promise<ResultOK<ServiceReply>>;
}
