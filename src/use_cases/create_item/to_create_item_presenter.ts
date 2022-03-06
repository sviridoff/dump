import { Item } from '../../stores/item_store.js';
import { User } from '../../stores/user_store.js';

interface CreateItemPresenter {
  user: User;
  item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  };
}

export function toCreateItemPresenter(
  item: Item,
  user: User,
): CreateItemPresenter {
  return {
    user,
    item: {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    },
  };
}
