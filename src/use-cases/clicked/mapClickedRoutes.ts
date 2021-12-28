import { ClickedController } from './ClickedController.js';
import { Route } from '../../types/Route.js';

export function mapClickedRoutes(
  clickedController: ClickedController,
): Route[] {
  return [
    {
      method: 'POST',
      path: '/clicked',
      handler: clickedController.handler,
    },
  ];
}
