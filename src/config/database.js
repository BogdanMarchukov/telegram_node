// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'mysecretpassword',
    database: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: '5432',
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: process.env.POSTGRES_HOST,
    dialect: 'mysql',
  },
  production: {
    username: 'postgres',
    password: 'mysecretpassword',
    database: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: '5432',
    dialect: 'postgres',
  },
};
