const express = require("express");
const expressAsyncHandler = require("express-async-handler");

//import Models
const Category = require("../models/category.model");

const {
  setAndSendResponse,
  responseError,
  callRes,
} = require("../constants/response_code");

const { isNumber, isValidId } = require("../validations/validateData");

const categoryController = {};

categoryController.get_category = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  // chưa tìm được cách nhập /:id mà trả về undefined
  console.log(":id:", id);
  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }
  try {
    let category = await Category.findById(id);
    if (category == null) {
      return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    let result = {
      id: category._id,
      described: category.described,
      title: category.title,
    };

    res.status(responseError.OK.statusCode).json({
      code: responseError.OK.body.code,
      message: responseError.OK.body.message,
      data: result,
    });
  } catch (err) {
    return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
  }
});

categoryController.get_list_categories = expressAsyncHandler(
  async (req, res) => {
    try {
      const categories = await Category.find();
      // console.log(categorys.map(category => category._id));
      if (categories.length < 1) {
        return setAndSendResponse(res, responseError.NO_DATA);
      }

      let result = categories;

      res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result,
      });
    } catch (err) {
      return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
    }
  }
);

categoryController.add_category = expressAsyncHandler(async (req, res) => {
  var { describe, title } = req.body;

  console.log(req.body);

  // bắt buộc có nội dung, up mỗi ảnh không được
  if (!title) {
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  }

  let category = new Category();

  category.describe = describe;
  category.title = title;

  try {
    const savedCategory = await category.save();
    let categoryResult = await Category.findById(savedCategory._id);

    let result = res.status(201).json({
      code: responseError.OK.body.code,
      message: responseError.OK.body.message,
      data: categoryResult,
    });
  } catch (err) {
    // console.log("CAN_NOT_CONNECT_TO_DB");
    return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }
});

categoryController.delete_category = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;

  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }

  let category;
  try {
    category = await Category.findById(id);
  } catch (err) {
    // console.log("Can not connect to DB");
    return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }

  if (!category) {
    // console.log("Category is not existed");
    return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
  }

  try {
    await Category.findByIdAndDelete(id);
    setAndSendResponse(res, responseError.OK);
  } catch (error) {
    // console.log(error);
    setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }
});

module.exports = categoryController;
