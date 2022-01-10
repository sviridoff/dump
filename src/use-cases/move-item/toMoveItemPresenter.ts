import { Item } from '../../stores/ItemStore.js';
import { User } from '../../stores/UserStore.js';

interface MoveItemPresenter {
  user: User;
  item: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  };
  items: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  }[];
}

export function toMoveItemPresenter(
  item: Item,
  items: Item[],
  user: User,
): MoveItemPresenter {
  return {
    user,
    item: {
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    },
    items: items.map((item) => ({
      ...item,
      visibility: item.isPrivate ? 'private' : 'public',
    })),
  };
}
