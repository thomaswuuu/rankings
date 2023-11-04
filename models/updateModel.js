const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
  platform: { type: String, require: true },
  updateAt: { type: String, require: true },
});

const updateModel = mongoose.model("updateTime", updateSchema);

module.exports = updateModel;
