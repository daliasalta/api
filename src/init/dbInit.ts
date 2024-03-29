import mongoose from "mongoose";

export async function dbInit () {
  try {
    const MONGO_URI = process.env.MONGO_DB as string;
    const connection = mongoose.connect(MONGO_URI!);

    return connection
  } catch (error) {
    console.error(error)
  }
}
