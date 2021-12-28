import { Route } from '../../types/Route.js';
import { Controller } from '../../types/Controller.js';

export function mapClickedRoutes(
  clickedController: Controller,
): Route[] {
  return [
    {
      method: 'POST',
      path: '/clicked',
      handler: clickedController.handler.bind(
        clickedController,
      ),
    },
  ];
}
