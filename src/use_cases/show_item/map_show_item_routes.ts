import { AppRoute } from '../../types/app_route.js';
import { AppController } from '../../types/app_controller.js';

export function urlToShowItem(
  username: string,
  itemSlug: string,
): string {
  return `/${username}/${itemSlug}`;
}

export function mapShowItemRoutes(
  showItemController: AppController,
): AppRoute[] {
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
