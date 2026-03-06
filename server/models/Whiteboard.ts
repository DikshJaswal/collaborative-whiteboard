import mongoose from "mongoose"

const StrokeSchema = new mongoose.Schema({
  id: String,
  color: String,
  width: Number,
  points: [
    {
      x: Number,
      y: Number
    }
  ]
})

const WhiteboardSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  strokes: [StrokeSchema]
})

export default mongoose.model("Whiteboard", WhiteboardSchema)