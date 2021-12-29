import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapShowItemRoutes(
  showItemController: ServiceController,
): ServiceRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug',
      handler: showItemController.handler.bind(
        showItemController,
      ),
    },
  ];
}
