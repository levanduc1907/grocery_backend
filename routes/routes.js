const express = require("express");

const mainRouter = express.Router();
const accountRouter = require("./account.route");
const postRouter = require("./post.route");
const videoRouter = require("./video.route");
const commentRouter = require("./comment.route");
const searchRouter = require("./search.route");
const importDataRouter = require("../rawdatas/dataimport.js");
const learnMongooseRouter = require("./learnMongoose.route.js");
const categoryRouter = require("./category.route.js");
const { notFound, errorHandler } = require("../middlewares/error.middleware");
const productRouter = require("./product.route.js");

mainRouter.use("/account", accountRouter);
mainRouter.use("/post", postRouter);
mainRouter.use("/video", videoRouter);
mainRouter.use("/comment", commentRouter);
mainRouter.use("/search", searchRouter);
mainRouter.use("/import", importDataRouter);
mainRouter.use("/category", categoryRouter);
mainRouter.use("/product", productRouter);
mainRouter.use("/learnMongoose", learnMongooseRouter);

// sử dụng middleware theo thứ tự từ trên xuống, nếu đảo 2 dòng dưới đây lên đầu thì app sẽ nhảy vào luôn và báo lỗi
mainRouter.use(notFound); // a middleware function with no mount path. This code is executed for every request to the route
mainRouter.use(errorHandler);

module.exports = mainRouter;
