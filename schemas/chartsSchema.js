const mongoose = require("mongoose");

const chartsSchema = new mongoose.Schema({
  id: { type: String, require: true },
  chartNo: { type: Number, require: true },
  title: { type: String, require: true },
  cover: { type: String, require: true },
});

module.exports = chartsSchema;
