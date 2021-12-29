import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapNewItemRoutes(
  newItemController: ServiceController,
): ServiceRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/new',
      handler: newItemController.handler.bind(
        newItemController,
      ),
    },
  ];
}
