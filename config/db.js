const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect to MongoDB successfully!");
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
