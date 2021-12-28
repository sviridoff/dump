import { Controller } from './Controller.js';

export interface Route {
  method: 'GET' | 'POST';
  path: string;
  handler: Controller['handler'];
}
