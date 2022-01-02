import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function mapEditItemRoutes(
  editItemController: ServiceController,
): ServiceRoute[] {
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
