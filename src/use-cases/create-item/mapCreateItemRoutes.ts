import { AppRoute } from '../../types/AppRoute.js';
import { AppController } from '../../types/AppController.js';

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
