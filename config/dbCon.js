
const mongoose = require("mongoose");

module.exports = {
  connectDB: async () => {
    try {
      mongoose.set("strictQuery", false);

      const mongoUrl = process.env.mongo_cloud;

      if (!mongoUrl) {
        throw new Error("mongo_cloud environment variable is missing");
      }

      await mongoose.connect(mongoUrl);

      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err.message);
      throw err;
    }
  },
};