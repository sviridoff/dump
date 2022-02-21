import { AppRoute } from '../../types/AppRoute.js';
import { AppController } from '../../types/AppController.js';

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
