import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapItemRoutes(
  itemController: ServiceController,
): ServiceRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug',
      handler: itemController.handler.bind(itemController),
    },
  ];
}
