import mongoose from "mongoose"

const MONGO_URI = "mongodb://127.0.0.1:27017/whiteboard"

export async function connectDB() {

  try {

    await mongoose.connect(MONGO_URI)

    console.log("MongoDB connected")

  } catch (error) {

    console.error("MongoDB error:", error)
  }
}