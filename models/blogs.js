const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  datePosted: { type: Date, required: true, default: Date.now },
  comments: { type: Schema.Types.ObjectId, ref: "Comments" },
  status: { type: String, required: true, enum: ["Published", "Draft"] },
});

blogSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

// Export model
module.exports = mongoose.model("Blogs", blogSchema);
