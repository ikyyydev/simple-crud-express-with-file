import { Sequelize } from "sequelize";

const database = new Sequelize("simple_crud_with_file", "root", "mehongsek", {
  host: "localhost",
  dialect: "mysql",
});

export default database;
