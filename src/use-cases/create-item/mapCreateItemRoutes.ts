import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapCreateItemRoutes(
  createItemController: ServiceController,
): ServiceRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/new',
      handler: createItemController.handler.bind(
        createItemController,
      ),
    },
  ];
}
