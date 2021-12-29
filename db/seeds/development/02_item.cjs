exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('item').insert([
    {
      id: '397570ce-9c62-42cd-8336-26bdd972446e',
      user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
      name: 'Item 1',
      slug: 'item-1',
    },
    {
      id: '6f9114b2-51c2-41f5-b2f9-22379dc63334',
      user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
      name: 'Item 2',
      slug: 'item-2',
    },
    {
      id: '0021ad2e-e635-42ca-a4ac-ad3daea2b143',
      user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
      name: 'Item 3',
      slug: 'item-3',
    },
    {
      id: 'c19a86ad-ef23-4d28-b753-9ab4a7cfad25',
      user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
      name: 'Item 4',
      slug: 'item-4',
    },
    {
      id: '66ce05eb-1bdb-4b83-8276-e9f7e27a94b6',
      user_id: '3dd292d6-f415-4939-bb67-41abd0e901a0',
      name: 'Item 5',
      slug: 'item-5',
    },
  ]);
};
