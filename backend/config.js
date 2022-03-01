const config = {
  db: {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectionLimit: 10,
    port: 3306,
    connectTimeout: 40000,
  },
  listPerPage: 10,
};
module.exports = config;
