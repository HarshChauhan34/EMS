import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    try {
      await mongoose.connection.collection("users").dropIndex("passwordResetExpires_1");
      console.log("Removed legacy TTL index: users.passwordResetExpires_1");
    } catch (indexError) {
      if (indexError.codeName !== "IndexNotFound") {
        console.warn("Could not verify legacy reset-token TTL index:", indexError.message);
      }
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
