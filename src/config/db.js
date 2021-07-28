const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://thuancafe:thuancafe@cluster0.sgzov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //useCreateIndex: true,
      }
    );

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
