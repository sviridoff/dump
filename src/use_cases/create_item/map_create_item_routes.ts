import { AppRoute } from '../../types/app_route.js';
import { AppController } from '../../types/app_controller.js';

export function mapCreateItemRoutes(
  createItemController: AppController,
): AppRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/new',
      handler: createItemController.handler.bind(
        createItemController,
      ),
    },
    {
      method: 'POST',
      path: '/:username/:itemSlug/new',
      handler: createItemController.handler.bind(
        createItemController,
      ),
    },
  ];
}
