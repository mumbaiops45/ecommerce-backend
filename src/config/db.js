import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MongoDB Error: MONGO_URI is not set in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    if (error.message.includes("querySrv") || error.message.includes("ECONNREFUSED")) {
      console.error(
        "\n  Fix: Go to MongoDB Atlas → Network Access → Add IP Address\n" +
        "  Add your current IP or use 0.0.0.0/0 to allow all IPs (dev only).\n" +
        "  Or switch to local MongoDB: set MONGO_URI=mongodb://localhost:27017/ecommerce in .env\n"
      );
    }
    process.exit(1);
  }
};

export default connectDB;