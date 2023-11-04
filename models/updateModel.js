const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
  platform: { type: String, require: true },
  updateAt: { type: String, require: true },
});
const statusSchema = new mongoose.Schema({
  status: { type: String, require: true },
});

const updateTime = mongoose.model("updateTime", updateSchema);
const updateStatus = mongoose.model("updateStatus", statusSchema);

const getUpdateTime = () => {
  return updateTime;
};
const getUpdateStatus = () => {
  return updateStatus;
};

module.exports = {
  getUpdateTime,
  getUpdateStatus,
};
