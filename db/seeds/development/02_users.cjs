exports.seed = function (knex) {
  // Deletes ALL existing entries.
  return knex('user')
    .del()
    .then(function () {
      // Inserts seed entries.
      return knex('user').insert([
        {
          name: 'svirisama',
          item_id: '397570ce-9c62-42cd-8336-26bdd972446e',
        },
      ]);
    });
};
