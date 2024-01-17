const express = require("express");
const expressAsyncHandler = require("express-async-handler");

//import Models
const Product = require("../models/product.model");
const Comment = require("../models/comment.model");
const Account = require("../models/account.model");

const {
  setAndSendResponse,
  responseError,
  callRes,
} = require("../constants/response_code");

const { isNumber, isValidId } = require("../validations/validateData");

//import cloud storage
const cloudinary = require("../config/cloudinaryConfig");
const Category = require("../models/category.model");

const MAX_IMAGE_NUMBER = 4;
const MAX_SIZE_IMAGE = 4 * 1024 * 1024; // for 4MB
const MAX_VIDEO_NUMBER = 1;
const MAX_SIZE_VIDEO = 10 * 1024 * 1024; // for 10MB
const MAX_WORD_POST = 500;

function countWord(str) {
  return str.split(" ").length;
}

const productsController = {};

productsController.get_product = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  // chưa tìm được cách nhập /:id mà trả về undefined
  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }
  console.log("id:", id);
  try {
    let product = await Product.findById(id);
    if (product == null) {
      return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    let author = await Account.findOne({ _id: product.account_id }).exec();
    let category = await Category.findOne({ _id: product.category_id }).exec();
    let result = {
      id: product._id,
      author: {
        id: author._id,
        name: author.name,
        avatar: author.getAvatar(),
      },
      title: product.title,
      described: product.described,
      price: product.price,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      comments: product.comments,
      category: {
        id: category._id,
        title: category.title,
      },
      banned: product.banned,
      can_comment: product.canComment,
    };
    if (product.images.length !== 0) {
      result.images = product.images.map((image) => {
        let { url, publicId } = image;
        return { url: url, publicId: publicId };
      });
    }
    if (product.video && product.video.url != undefined) {
      result.video = {
        url: product.video.url,
        publicId: product.getVideoThumb(),
      };
    }

    res.status(responseError.OK.statusCode).json({
      code: responseError.OK.body.code,
      message: responseError.OK.body.message,
      data: result,
    });
  } catch (err) {
    return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
  }
});

productsController.get_list_products = expressAsyncHandler(async (req, res) => {
  console.log(req.query);

  let perPage = req.query?.limit || 16; // số lượng sản phẩm xuất hiện trên 1 page
  let page = req.query?.page || 1;
  let total = await Product.countDocuments({}).exec();
  console.log("okay");
  try {
    const products = await Product.find()
      .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .populate({ path: "account_id", model: Account })
      .populate({ path: "category_id", model: Category })
      .sort("-createdAt");
    // console.log(products.map(product => product._id));
    if (products.length < 1) {
      return setAndSendResponse(res, responseError.NO_DATA);
    }
    console.log("products.length", products.length);
    let result = {
      products: products.map((product) => {
        let category = Category.findOne({
          _id: product.category_id,
        }).exec();
        let subResult = {
          id: product._id,
          author: {
            id: product.account_id._id,
            name: product.account_id.name,
            avatar: product.account_id.getAvatar(),
          },
          title: product.title,
          described: product.described,
          price: product.price,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          comments: product.comments,
          category: {
            id: product.category_id._id,
            title: product.category_id.title,
          },
          banned: product.banned,
          can_comment: product.canComment,
        };
        if (product.images.length !== 0) {
          subResult.images = product.images.map((image) => {
            let { url, publicId } = image;
            return { url: url, publicId: publicId };
          });
        }
        if (product.video && product.video.url != undefined) {
          subResult.video = {
            url: product.video.url,
            publicId: product.getVideoThumb(),
          };
        }
        return subResult;
      }),
      pageInfo: {
        currentPage: parseInt(page),
        limit: perPage,
        total: total,
      },
    };
    res.status(responseError.OK.statusCode).json({
      code: responseError.OK.body.code,
      message: responseError.OK.body.message,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return setAndSendResponse(res, err);
  }
});

productsController.get_list_products_of_category = expressAsyncHandler(
  async (req, res) => {
    console.log(req.query);
    const { category_id } = req.params;
    let perPage = req.query?.limit || 16; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.query?.page || 1;
    console.log("okay");
    try {
      const products = await Product.find()
        .where("category_id")
        .equals(category_id)
        .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .populate({ path: "account_id", model: Account })
        .populate({ path: "category_id", model: Category })
        .sort("-createdAt");
      // console.log(products.map(product => product._id));
      if (products.length < 1) {
        return setAndSendResponse(res, responseError.NO_DATA);
      }
      console.log("products.length", products.length);
      let result = {
        products: products.map((product) => {
          let category = Category.findOne({
            _id: product.category_id,
          }).exec();
          let subResult = {
            id: product._id,
            author: {
              id: product.account_id._id,
              name: product.account_id.name,
              avatar: product.account_id.getAvatar(),
            },
            title: product.title,
            described: product.described,
            price: product.price,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            comments: product.comments,
            category: {
              id: product.category_id._id,
              title: product.category_id.title,
            },
            banned: product.banned,
            can_comment: product.canComment,
          };
          if (product.images.length !== 0) {
            subResult.images = product.images.map((image) => {
              let { url, publicId } = image;
              return { url: url, publicId: publicId };
            });
          }
          if (product.video && product.video.url != undefined) {
            subResult.video = {
              url: product.video.url,
              publicId: product.getVideoThumb(),
            };
          }
          return subResult;
        }),
      };
      res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: result,
      });
    } catch (err) {
      console.log(err);
      return setAndSendResponse(res, err);
    }
  }
);

productsController.get_list_products_by_account_id = expressAsyncHandler(
  async (req, res) => {
    var account_id = req.params.account_id;
    let perPage = req.query.limit || 16; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.query.page || 1;

    // người dùng bị khóa tài khoản
    if (req.account.isBlocked)
      return setAndSendResponse(res, responseError.NOT_ACCESS);

    try {
      const products = await Product.find()
        .where("account_id")
        .equals(account_id)
        .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .populate({ path: "account_id", model: Account })
        .sort("-createdAt");

      if (products.length < 1) {
        return setAndSendResponse(res, responseError.NO_DATA);
      }

      let index_last_id;
      if (last_id)
        index_last_id = products.findIndex((element) => {
          return element._id == last_id;
        });
      else index_last_id = index - 1;
      // console.log(index_last_id);
      let sliceProducts = products.slice(
        index_last_id + 1,
        index_last_id + 1 + count
      );
      // console.log(sliceProducts)
      if (sliceProducts.length < 1) {
        // console.log('No have products');
        return setAndSendResponse(res, responseError.NO_DATA);
      }

      let result = {
        products: sliceProducts.map((product) => {
          const isBlocked =
            product.account_id.blockedAccounts.findIndex((element) => {
              return element.account.toString() === req.account._id.toString();
            }) !== -1;
          let subResult = {
            id: product._id,
            described: product.described,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            likes: product.likes,
            comments: product.comments,
            author: {
              id: product.account_id._id,
              name: product.account_id.name,
              avatar: product.account_id.getAvatar(),
            },
            is_liked: product.likedAccounts.includes(req.account._id),
            status: product.status,
            is_blocked: isBlocked,
            can_edit: req.account._id.equals(product.account_id._id)
              ? product.banned
                ? false
                : true
              : false,
            banned: product.banned,
            can_comment: product.canComment,
          };
          if (product.images.length !== 0) {
            subResult.images = product.images.map((image) => {
              let { url, publicId } = image;
              return { url: url, publicId: publicId };
            });
          }
          if (product.video && product.video.url != undefined) {
            subResult.video = {
              url: product.video.url,
              publicId: product.getVideoThumb(),
            };
          }
          return subResult;
        }),
        new_items: index_last_id + 1 - index,
      };
      if (sliceProducts.length > 0) {
        result.last_id = sliceProducts[sliceProducts.length - 1]._id;
      }
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

productsController.add_product = expressAsyncHandler(async (req, res) => {
  var { title, describe, category_id, price } = req.body;

  console.log(req.body);
  let image, video;
  if (req.files) {
    image = req.files.image;
    video = req.files.video;
  }

  // bắt buộc có nội dung, up mỗi ảnh không được
  if (!title || !price) {
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  }

  //có cả ảnh và video
  if (req.files && image && video) {
    // console.log("có cả ảnh và video => từ chối");
    return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
  }

  let product = new Product();

  const category = await Category.findOne({ _id: category_id }).exec();

  if (!category) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }

  if (image) {
    //upload ảnh
    // middleware đã check nhưng chung cho cả video và ảnh nên check lại
    console.log("leangth", image.length);
    if (image.length > MAX_IMAGE_NUMBER) {
      console.log("max loeasdfaf");
      return setAndSendResponse(res, responseError.MAXIMUM_NUMBER_OF_IMAGES);
    }

    for (const item_image of image) {
      // middleware đã check rồi, nên không cần nữa
      // const filetypes  = /jpeg|jpg|png/;
      // const mimetype = filetypes.test(item_image.mimetype);

      // if(!mimetype) {
      //     return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
      // }

      if (item_image.buffer.bytelength > MAX_SIZE_IMAGE) {
        return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
      }
    }

    try {
      console.log("here");
      let uploadPromises = image.map(cloudinary.uploads);
      let data = await Promise.all(uploadPromises);
      //xửa lý data
      product.images = data;
    } catch (err) {
      //lỗi không xác định
      // console.log(err);
      return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }
  }

  if (video) {
    //upload video
    if (video.length > MAX_VIDEO_NUMBER) {
      // console.log("MAX_VIDEO_NUMBER");
      return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
    }

    for (const item_video of video) {
      const filetypes = /mp4/;
      const mimetype = filetypes.test(item_video.mimetype);
      if (!mimetype) {
        // console.log("Mimetype video is invalid");
        return setAndSendResponse(
          res,
          responseError.PARAMETER_VALUE_IS_INVALID
        );
      }

      if (item_video.buffer.byteLength > MAX_SIZE_VIDEO) {
        // console.log("Max video file size");
        return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
      }
    }
    try {
      let data = await cloudinary.uploads(video[0]);
      //xử lý data
      product.video = data;
    } catch (error) {
      //lỗi không xác định
      return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
    }
  }

  product.account_id = req.account._id;
  product.describe = describe;
  product.title = title;
  product.category_id = category._id;

  product.price = price;

  try {
    const savedProduct = await product.save();
    let productResult = await Product.findById(savedProduct._id).populate({
      path: "category_id",
      model: Category,
    });

    let result = {
      id: productResult._id,
      title: productResult.title,
      price: productResult.price,
      describe: productResult.describe,
      createdAt: productResult.createdAt,
      updatedAt: productResult.updatedAt,
      comments: 0,
      author: {
        id: req.account._id,
        name: req.account.name,
        avatar: req.account.getAvatar(),
      },
      category: {
        id: productResult.category_id._id,
        title: productResult.category_id.title,
      },
      banned: productResult.banned,
      can_comment: productResult.canComment,
    };
    if (productResult.images.length !== 0) {
      result.images = productResult.images.map((image) => {
        let { url, publicId } = image;
        return { url: url, publicId: publicId };
      });
    }
    if (productResult.video && productResult.video.url != undefined) {
      result.video = {
        url: productResult.video.url,
        publicId: productResult.getVideoThumb(),
      };
    }
    res.status(201).json({
      code: responseError.OK.body.code,
      message: responseError.OK.body.message,
      data: result,
    });
  } catch (err) {
    // console.log("CAN_NOT_CONNECT_TO_DB");
    console.log(err);
    return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }
});

productsController.delete_product = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;

  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }

  let product;
  try {
    product = await Product.findById(id);
  } catch (err) {
    // console.log("Can not connect to DB");
    return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }

  if (!product) {
    // console.log("Product is not existed");
    return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
  }

  // console.log(product.account_id);
  // console.log(req.account._id);
  if (!product.account_id.equals(req.account._id)) {
    // console.log("Not Access");
    return setAndSendResponse(res, responseError.NOT_ACCESS);
  }

  try {
    await Product.findByIdAndDelete(id);

    try {
      if (product.images.length > 0) {
        for (let image of product.images) {
          cloudinary.removeImg(image.publicId);
        }
      }
      if (product.video && product.video.publicId)
        cloudinary.removeVideo(product.video.publicId);
    } catch (error) {
      // console.log("Khong xoa duoc anh hoặc video");
      return setAndSendResponse(res, responseError.EXCEPTION_ERROR);
    }
    // xóa comment
    Comment.deleteMany({ product_id: product._id });

    setAndSendResponse(res, responseError.OK);
  } catch (error) {
    // console.log(error);
    setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
  }
});

// productsController.edit_product = expressAsyncHandler(async (req, res) => {
//   var { id, status, image_del, described } = req.body;
//   var image, video;
//   if (req.files) {
//     image = req.files.image;
//     video = req.files.video;
//   }
//   var user = req.account;

//   // console.log(id, status, image_del, described, user);
//   if (image_del) {
//     if (!Array.isArray(image_del)) {
//       try {
//         image_del = JSON.parse(image_del);
//       } catch (err) {
//         // console.log("image_del parse loi PARAMETER_TYPE_IS_INVALID");
//         return setAndSendResponse(
//           res,
//           responseError.PARAMETER_VALUE_IS_INVALID
//         );
//       }
//       if (!Array.isArray(image_del)) {
//         // console.log("image_del PARAMETER_TYPE_IS_INVALID");
//         return setAndSendResponse(
//           res,
//           responseError.PARAMETER_VALUE_IS_INVALID
//         );
//       }
//     }
//     for (const id_image_del of image_del) {
//       if (typeof id_image_del !== "string") {
//         // console.log("image_del element PARAMETER_TYPE_IS_INVALID");
//         return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
//       }
//     }
//     image_del = image_del.filter((item, i, ar) => ar.indexOf(item) === i);
//   } else {
//     image_del = [];
//   }

//   // console.log("image_del lúc sau",image_del)

//   // PARAMETER_IS_NOT_ENOUGH
//   if (id !== "" && !id) {
//     // console.log("No have parameter id");
//     return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
//   }

//   // PARAMETER_TYPE_IS_INVALID
//   if (
//     (id && typeof id !== "string") ||
//     (described && typeof described !== "string") ||
//     (status && typeof status !== "string")
//   ) {
//     // console.log("PARAMETER_TYPE_IS_INVALID");
//     return setAndSendResponse(res, responseError.PARAMETER_TYPE_IS_INVALID);
//   }

//   if (described && countWord(described) > MAX_WORD_POST) {
//     // console.log("MAX_WORD_POST");
//     return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
//   }

//   if (status && !statusArray.includes(status)) {
//     // console.log("Sai status");
//     return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
//   }

//   if (image && video) {
//     // console.log("Có cả image and video gui di");
//     return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
//   }

//   let product;
//   try {
//     product = await Product.findById(id);
//   } catch (err) {
//     // console.log("Can not connect to DB");
//     return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
//   }

//   if (!product) {
//     // console.log("Product is not existed");
//     return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
//   }

//   // console.log(product)
//   // console.log(product.account_id)
//   // console.log(user._id)
//   if (!product.account_id.equals(user._id)) {
//     // console.log("Not Access");
//     return setAndSendResponse(res, responseError.NOT_ACCESS);
//   }

//   // Check gia tri image_del hop le
//   if (image_del && image_del.length > 0) {
//     for (const id_image_del of image_del) {
//       let isInvalid = true;
//       for (const image of product.images) {
//         if (image._id == id_image_del) {
//           isInvalid = false;
//         }
//       }
//       if (isInvalid) {
//         // console.log("Sai id");
//         return setAndSendResponse(
//           res,
//           responseError.PARAMETER_VALUE_IS_INVALID
//         );
//       }
//     }

//     // Xoa anh
//     for (const id_image_del of image_del) {
//       // console.log("xoa anh");
//       var i;
//       for (i = 0; i < product.images.length; i++) {
//         if (product.images[i]._id == id_image_del) {
//           break;
//         }
//       }
//       // console.log(i)
//       try {
//         cloudinary.removeImg(product.images[i].publicId);
//       } catch (err) {
//         return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
//       }
//       product.images.splice(i, 1);
//     }
//   }

//   let promises, file;

//   if (video && !image) {
//     if (product.images.length != 0) {
//       // console.log("Có video và ko có ảnh");
//       return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
//     }

//     if (video.length > MAX_VIDEO_NUMBER) {
//       // console.log("MAX_VIDEO_NUMBER");
//       return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
//     }

//     for (const item_video of video) {
//       const filetypes = /mp4/;
//       const mimetype = filetypes.test(item_video.mimetype);
//       if (!mimetype) {
//         // console.log("Mimetype video is invalid");
//         return setAndSendResponse(
//           res,
//           responseError.PARAMETER_VALUE_IS_INVALID
//         );
//       }

//       if (item_video.buffer.byteLength > MAX_SIZE_VIDEO) {
//         // console.log("Max video file size");
//         return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
//       }
//     }

//     // promises = video.map(video => {
//     //     return cloudinary.uploads(video);
//     // });
//     // let data = await cloudinary.uploads(video[0]);
//     //     //xử lý data
//     //     product.video = data;

//     try {
//       if (product.video.url) {
//         cloudinary.removeVideo(product.video.publicId);
//       }
//     } catch (err) {
//       return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
//     }

//     try {
//       // file = await Promise.all(promises);
//       // product.video = file[0];
//       let data = await cloudinary.uploads(video[0]);
//       //xử lý data
//       product.video = data;
//     } catch (err) {
//       // console.log("Upload fail");
//       return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
//     }
//   }

//   if (image && !video) {
//     console.log("đến đây");
//     if (product.video.url) {
//       // console.log("Có cả ảnh và video");
//       return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
//     }

//     // for(const item_image of image) {
//     //     const filetypes = /jpeg|jpg|png/;
//     //     const mimetype = filetypes.test(item_image.mimetype);
//     //     if(!mimetype) {
//     //         console.log("Mimetype image is invalid");
//     //         return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
//     //     }

//     //     if (item_image.buffer.byteLength > MAX_SIZE_IMAGE) {
//     //         console.log("Max image file size");
//     //         return setAndSendResponse(res, responseError.FILE_SIZE_IS_TOO_BIG);
//     //     }
//     // }

//     if (image.length + product.images.length > MAX_IMAGE_NUMBER) {
//       // console.log("Max image number");
//       return setAndSendResponse(res, responseError.MAXIMUM_NUMBER_OF_IMAGES);
//     }

//     promises = image.map((item_image) => {
//       return cloudinary.uploads(item_image);
//     });

//     try {
//       // console.log("đến đây chưa");
//       file = await Promise.all(promises);
//       for (let file_item of file) {
//         product.images.push(file_item);
//       }
//       // let uploadPromises = image.map(cloudinary.uploads);
//       // let data= await Promise.all(uploadPromises);
//       // //xửa lý data
//       // product.images = data;
//     } catch (err) {
//       // console.log("Upload fail");
//       return setAndSendResponse(res, responseError.UPLOAD_FILE_FAILED);
//     }
//   }

//   if (described) {
//     // console.log("Have described");
//     if (countWord(described) > MAX_WORD_POST) {
//       // console.log("MAX_WORD_POST");
//       return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
//     }
//     product.described = described;
//   }

//   if (status) {
//     // console.log("Have status");
//     product.status = status;
//   }

//   try {
//     // product.modified = Math.floor(Date.now() / 1000);
//     const savedProduct = await product.save();
//     return res.status(responseError.OK.statusCode).send({
//       code: responseError.OK.body.code,
//       message: responseError.OK.body.message,
//     });
//   } catch (err) {
//     // console.log("Edit fail");
//     return setAndSendResponse(res, responseError.CAN_NOT_CONNECT_TO_DB);
//   }
// });

productsController.like_product = expressAsyncHandler(async (req, res) => {
  const id = req.body.id;
  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }

  if (req.account.isBlocked)
    return setAndSendResponse(res, responseError.NOT_ACCESS);

  try {
    let product = await Product.findById(id);
    if (product == null) {
      return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    // bài viết bị khóa
    if (product.banned) {
      // console.log("bài viết bị khóa");
      return setAndSendResponse(res, responseError.POST_IS_BANNED);
    }

    let author = await Account.findOne({ _id: product.account_id }).exec();
    if (author == null) setAndSendResponse(res, responseError.NO_DATA);
    let user = req.account;

    var isBlocked = false;
    if (author?.blockedAccounts.length != 0)
      isBlocked =
        author?.blockedAccounts.findIndex((element) => {
          return element.account.toString() === user._id.toString();
        }) !== -1;
    if (!isBlocked) {
      if (user?.blockedAccounts.length != 0)
        isBlocked =
          user?.blockedAccounts?.findIndex((element) => {
            return element.account.toString() === author._id.toString();
          }) !== -1;
    }
    if (isBlocked)
      return callRes(
        res,
        responseError.NOT_ACCESS,
        "Người viết đã chặn bạn / Bạn chặn người viết, do đó không thể like bài viết"
      );

    if (
      product?.likedAccounts.findIndex((element) => {
        return element.equals(user._id);
      }) != -1
    )
      return setAndSendResponse(res, responseError.HAS_BEEN_LIKED);
    else {
      await Product.findOneAndUpdate(
        { _id: id },
        { $push: { likedAccounts: { _id: user._id } } }
      );
      var updatedProduct = await Product.findOneAndUpdate(
        { _id: id },
        { $inc: { likes: 1 } },
        { new: true }
      );
      res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: {
          likes: updatedProduct.likes,
        },
      });
    }
  } catch (err) {
    return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
  }
});

productsController.unlike_product = expressAsyncHandler(async (req, res) => {
  const id = req.body.id;
  if (id === undefined)
    return setAndSendResponse(res, responseError.PARAMETER_IS_NOT_ENOUGH);
  if (!isValidId(id)) {
    return setAndSendResponse(res, responseError.PARAMETER_VALUE_IS_INVALID);
  }

  if (req.account.isBlocked)
    return setAndSendResponse(res, responseError.NOT_ACCESS);

  try {
    let product = await Product.findById(id);
    if (product == null) {
      return setAndSendResponse(res, responseError.POST_IS_NOT_EXISTED);
    }

    // bài viết bị khóa
    if (product.banned) {
      // console.log("bài viết bị khóa");
      return setAndSendResponse(res, responseError.POST_IS_BANNED);
    }

    let author = await Account.findOne({ _id: product.account_id }).exec();
    if (author == null) setAndSendResponse(res, responseError.NO_DATA);
    let user = req.account;

    if (
      product?.likedAccounts.findIndex((element) => {
        return element.equals(user._id);
      }) == -1
    )
      return setAndSendResponse(res, responseError.HAS_NOT_BEEN_LIKED);
    else {
      await Product.findOneAndUpdate(
        { _id: id },
        { $pull: { likedAccounts: user._id } }
      );
      var updatedProduct = await Product.findOneAndUpdate(
        { _id: id },
        { $inc: { likes: -1 } },
        { new: true }
      );
      res.status(responseError.OK.statusCode).json({
        code: responseError.OK.body.code,
        message: responseError.OK.body.message,
        data: {
          likes: updatedProduct.likes,
        },
      });
    }
  } catch (err) {
    return setAndSendResponse(res, responseError.UNKNOWN_ERROR);
  }
});

module.exports = productsController;
