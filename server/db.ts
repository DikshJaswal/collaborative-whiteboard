import mongoose from "mongoose"

const MONGO_URI = "mongodb+srv://whiteboarduser:djrss@1922@cluster0.ekxm47l.mongodb.net/?appName=Cluster0"

export async function connectDB() {

  try {

    await mongoose.connect(MONGO_URI)

    console.log("MongoDB connected")

  } catch (error) {

    console.error("MongoDB error:", error)
  }
}