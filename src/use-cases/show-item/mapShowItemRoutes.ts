import { AppRoute } from '../../types/AppRoute.js';
import { AppController } from '../../types/AppController.js';

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
