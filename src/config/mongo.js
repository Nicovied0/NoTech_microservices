const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    const DB_URI = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.1e4qqls.mongodb.net/${process.env.NAME_DB}?retryWrites=true&w=majority`;
 
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

mongoose.set("strictQuery", false);

module.exports = dbConnect;
