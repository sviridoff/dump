import { Route } from '../../types/Route.js';
import { Controller } from '../../types/Controller.js';

export function mapRootRoutes(
  rootController: Controller,
): Route[] {
  return [
    {
      method: 'GET',
      path: '/',
      handler: rootController.handler.bind(rootController),
    },
  ];
}
