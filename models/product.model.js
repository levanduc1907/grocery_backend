const mongoose = require("mongoose");
const Account = require("./account.model");
const Report = require("./report.model");
const Category = require("./category.model");

const productSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  describe: {
    type: String,
    required: false,
  },
  images: [{ filename: String, url: String, publicId: String }],
  video: { filename: String, url: String, publicId: String },
  commentList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  comments: {
    type: Number,
    required: false,
    default: 0,
  },
  status: {
    type: String,
    required: false,
  },

  canComment: {
    type: Boolean,
    required: true,
    default: true,
  },
  banned: {
    type: Boolean,
    required: true,
    default: false,
  },
  category_id: {
    type: String,
    required: true,
  },
});
productSchema.index({ _id: "text" });
productSchema.set("timestamps", true);

const Product = mongoose.model("product", productSchema);
Product.prototype.getVideoThumb = () => {
  const videoTailReg = /\.((wmv$)|(mp4$)|(avi$)|(wmv$)|(mov$)|(flv$))/gi;
  if (this.video != undefined) {
    return this.video.url.replace(videoTailReg, ".jpg");
  }
};
module.exports = Product;
