import Product from "../models/product-model.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    res.status(404).json({ message: "Product id not found" });
  }
};

export const createProduct = async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ message: "No file uploade" });
  }
  const name = req.body.name;
  const file = req.files.file;
  const fileSize = file.data.length;
  const extention = path.extname(file.name);
  const fileName = file.md5 + extention;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(extention.toLowerCase())) {
    return res.status(422).json({ message: "Invalid image type" });
  }

  if (fileSize > 5000000) {
    return res.status(422).json({ message: "Image must be less than 5MB" });
  }

  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error) return res.status(500).json({ message: error });

    try {
      const response = await Product.create({
        name: name,
        image: fileName,
        url: url,
      });
      res.status(201).json({
        message: "Product created susccessfully",
        data: response,
      });
    } catch (error) {
      console.log(error.message);
    }
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ message: "No data found" });

  let fileName = "";
  if (req.files === null) {
    fileName = product.image;
  } else {
    const file = req.files.file;
    const fileSize = file.data.length;
    const extention = path.extname(file.name);
    fileName = file.md5 + extention;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(extention.toLowerCase())) {
      return res.status(422).json({ message: "Invalid image type" });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ message: "Image must be less than 5MB" });
    }

    const filePath = `./public/images/${product.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/images/${fileName}`, (error) => {
      if (error) return res.status(500).json({ message: error.message });
    });
  }

  const name = req.body.name;
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    console.log(url);
    await Product.update(
      { name: name, image: fileName, url: url },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!product) return res.status(404).json({ message: "No data found" });
  try {
    const filePath = `./public/images/${product.image}`;
    fs.unlinkSync(filePath);
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Product id not found" });
  }
};
