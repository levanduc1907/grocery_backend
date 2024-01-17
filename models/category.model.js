const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  describe: {
    type: String,
    required: false,
  },
});
categorySchema.set("timestamps", true);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
