const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.DB_NAME ?? "database",
  process.env.DB_USER ?? "postgres",
  process.env.DB_PASSWORD ?? "password",
  {
    dialect: "postgres",
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ?? 5432,
    logging: false, // Enable logging for debugging purposes
  }
);
