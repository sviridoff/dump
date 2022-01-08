import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapDeleteItemRoutes(
  deleteItemController: ServiceController,
): ServiceRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/delete',
      handler: deleteItemController.handler.bind(
        deleteItemController,
      ),
    },
  ];
}
