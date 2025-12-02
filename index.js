import express from "express";
import cors from "cors";
import FileUpload from "express-fileupload";
import ProductRoute from "./routes/product-route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(ProductRoute);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
