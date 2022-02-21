import { AppController } from './AppController.js';

export interface AppRoute {
  method: 'GET' | 'POST';
  path: string;
  handler: AppController['handler'];
}
