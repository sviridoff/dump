import { ServiceRoute } from '../../types/ServiceRoute.js';
import { ServiceController } from '../../types/ServiceController.js';

export function urlToShowItem(
  username: string,
  itemSlug: string,
): string {
  return `/${username}/${itemSlug}`;
}

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
