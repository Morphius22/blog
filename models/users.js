const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  dateCreated: { type: Date, required: true, default: Date.now },
});

userSchema.virtual("url").get(function () {
  return `/index/${this._id}`;
});

// Export model
module.exports = mongoose.model("Users", userSchema);
