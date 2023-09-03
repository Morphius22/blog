const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Posts" },
});

commentSchema.virtual("url").get(function () {
  return `/index/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comments", commentSchema);
