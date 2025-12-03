import mongoose, { mongo } from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connection succesfull!");
    });

    connection.on("error", () => {
      console.log("MongoDB connection failed");
    });
  } catch (error) {
    console.log("Something went wrong!");
  }
}
