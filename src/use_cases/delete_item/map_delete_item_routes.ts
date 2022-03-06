import { AppRoute } from '../../types/app_route.js';
import { AppController } from '../../types/app_controller.js';

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
