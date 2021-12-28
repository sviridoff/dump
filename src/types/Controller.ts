import { ResultOK } from '@daisugi/kintsugi';

export interface Request {}
export interface Reply {
  templatePath: string;
  templateData: Record<string, unknown>;
}

export interface Controller {
  handler(request: Request): Promise<ResultOK<Reply>>;
}
