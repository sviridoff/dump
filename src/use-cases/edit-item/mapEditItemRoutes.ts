import { AppRoute } from '../../types/AppRoute.js';
import { AppController } from '../../types/AppController.js';

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
