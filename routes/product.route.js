const express = require("express");
const productRouter = express.Router();

const productsController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/uploadFile.middleware");

productRouter.get("/get_product/:id", productsController.get_product);
productRouter.get("/get_list_products/", productsController.get_list_products);
productRouter.get(
  "/get_list_products_of_category/:category_id",
  productsController.get_list_products_of_category
);
productRouter.get(
  "/get_list_products_by_user_id/",
  productsController.get_list_products_by_account_id
);
productRouter.post(
  "/add_product",
  uploadFile,
  auth,
  productsController.add_product
);
productRouter.post(
  "/delete_product/:id",
  auth,
  productsController.delete_product
);
module.exports = productRouter;
