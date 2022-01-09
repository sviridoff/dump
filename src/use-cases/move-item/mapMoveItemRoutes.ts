import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapMoveItemRoutes(
  moveItemController: ServiceController,
): ServiceRoute[] {
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
