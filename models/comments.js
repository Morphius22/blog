const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  blog: { type: Schema.Types.ObjectId, ref: "Blogs" },
});

commentSchema.virtual("url").get(function () {
  return `/index/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comments", commentSchema);
