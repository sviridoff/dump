exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('item_item').insert([
    {
      id: '7e5c1841-c015-4d6c-9388-26a08b51923b',
      parent_item_id:
        '397570ce-9c62-42cd-8336-26bdd972446e',
      child_item_id: '6f9114b2-51c2-41f5-b2f9-22379dc63334',
    },
    {
      id: 'ea7b37c3-fcab-4852-a402-4e263ddbef54',
      parent_item_id:
        '397570ce-9c62-42cd-8336-26bdd972446e',
      child_item_id: '0021ad2e-e635-42ca-a4ac-ad3daea2b143',
    },
    {
      id: '6d5a3f85-6977-4039-8e8e-05ad51fd8a93',
      parent_item_id:
        '397570ce-9c62-42cd-8336-26bdd972446e',
      child_item_id: 'c19a86ad-ef23-4d28-b753-9ab4a7cfad25',
    },
    {
      id: 'f06cc5a6-5988-408e-9df6-f41527e55321',
      parent_item_id:
        '397570ce-9c62-42cd-8336-26bdd972446e',
      child_item_id: '66ce05eb-1bdb-4b83-8276-e9f7e27a94b6',
    },
  ]);
};
