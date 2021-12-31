import { Item } from '../stores/ItemStore.js';

interface ItemPresenter {
  id: string;
  slug: string;
  title: string;
  isPrivate: boolean;
  visibility: 'public' | 'private';
  items: {
    id: string;
    slug: string;
    title: string;
    isPrivate: boolean;
    visibility: 'public' | 'private';
  }[];
}

export function toItemPresenter(item: Item): ItemPresenter {
  return {
    ...item,
    visibility: item.isPrivate ? 'private' : 'public',
    items: item.items.map((childItem) => {
      return {
        ...childItem,
        visibility: childItem.isPrivate
          ? 'private'
          : 'public',
      };
    }),
  };
}
