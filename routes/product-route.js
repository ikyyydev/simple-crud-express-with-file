import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product-controller.js";

const router = express.Router();

router.get("/api/products", getProducts);
router.get("/api/products/:id", getProductById);
router.post("/api/products", createProduct);
router.patch("/api/products/:id", updateProduct);
router.delete("/api/products/:id", deleteProduct);

export default router;
