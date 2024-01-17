const express = require("express");
const categoryRouter = express.Router();

const categorysController = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");

categoryRouter.get("/get_category/:id", categorysController.get_category);
categoryRouter.get(
  "/get_list_categories/",
  categorysController.get_list_categories
);
categoryRouter.post("/add_category", auth, categorysController.add_category);
categoryRouter.post(
  "/delete_category/:id",
  auth,
  categorysController.delete_category
);
module.exports = categoryRouter;
