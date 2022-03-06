import { AppRoute } from '../../types/app_route.js';
import { AppController } from '../../types/app_controller.js';

export function mapEditItemRoutes(
  editItemController: AppController,
): AppRoute[] {
  return [
    {
      method: 'GET',
      path: '/:username/:itemSlug/edit',
      handler: editItemController.handler.bind(
        editItemController,
      ),
    },
    {
      method: 'POST',
      path: '/:username/:itemSlug/edit',
      handler: editItemController.handler.bind(
        editItemController,
      ),
    },
  ];
}
