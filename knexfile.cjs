const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      user: 'postgres',
      password: '1234',
      database: 'svirisama',
    },
    migrations: {
      directory: `${__dirname}/db/migrations`,
    },
    seeds: {
      directory: `${__dirname}/db/seeds/development`,
    },
  },
};
