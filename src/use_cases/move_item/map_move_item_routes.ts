import { AppRoute } from '../../types/app_route.js';
import { AppController } from '../../types/app_controller.js';

export function mapMoveItemRoutes(
  moveItemController: AppController,
): AppRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/move',
      handler: moveItemController.handler.bind(
        moveItemController,
      ),
    },
    {
      method: 'POST',
      path: '/:username/:itemSlug/move',
      handler: moveItemController.handler.bind(
        moveItemController,
      ),
    },
  ];
}
