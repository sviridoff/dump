import { AppRoute } from '../../types/AppRoute.js';
import { AppController } from '../../types/AppController.js';

export function mapDeleteItemRoutes(
  deleteItemController: AppController,
): AppRoute[] {
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
