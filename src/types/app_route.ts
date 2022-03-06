import { AppController } from './app_controller.js';

export interface AppRoute {
  method: 'GET' | 'POST';
  path: string;
  handler: AppController['handler'];
}
