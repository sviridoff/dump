import { ServiceController } from './ServiceController.js';

export interface ServiceRoute {
  method: 'GET' | 'POST';
  path: string;
  handler: ServiceController['handler'];
}
