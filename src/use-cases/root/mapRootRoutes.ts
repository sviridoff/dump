import { RootController } from './RootController.js';
import { Route } from '../../types/Route.js';

export function mapRootRoutes(
  rootController: RootController,
): Route[] {
  return [
    {
      method: 'GET',
      path: '/',
      handler: rootController.handler,
    },
  ];
}
