const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const blog = mongoose.model("blogs", blogSchema);

module.exports = blog;
