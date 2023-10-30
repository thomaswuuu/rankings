const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  id: { type: String, require: true },
  track_id: { type: String, require: true },
  rankNo: { type: Number, require: true },
  title: { type: String, require: true },
  album: { type: String, require: true },
  artist: { type: String, require: true },
  link: { type: String, require: true },
  cover: { type: String, require: true },
  release_date: { type: String, require: true },
});

module.exports = musicSchema;
