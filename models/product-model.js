import { DataTypes } from "sequelize";
import database from "../libs/database.js";

const Product = database.define(
  "product",
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Product;

(async () => {
  await database.sync();
})();
