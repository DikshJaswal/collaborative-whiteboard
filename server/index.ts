import { createServer } from "http"
import { Server } from "socket.io"
import { connectDB } from "./db"
import Whiteboard from "./models/Whiteboard"

connectDB()

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {

  console.log("User connected:", socket.id)

  socket.on("join-room", async (roomId: string) => {

    socket.join(roomId)

    let board = await Whiteboard.findOne({ roomId })

    if (!board) {

      board = await Whiteboard.create({
        roomId,
        strokes: []
      })
    }

    socket.emit("board-state", board.strokes)
  })

  socket.on("draw", async ({ roomId, stroke }) => {

    await Whiteboard.updateOne(
      { roomId },
      { $push: { strokes: stroke } }
    )

    socket.to(roomId).emit("draw", stroke)
  })

  socket.on("undo", async ({ roomId }) => {

    const board = await Whiteboard.findOne({ roomId })

    if (!board) return

    board.strokes.pop()

    await board.save()

    socket.to(roomId).emit("undo")
  })

  socket.on("redo", ({ roomId, stroke }) => {

    socket.to(roomId).emit("redo", stroke)
  })

  socket.on("cursor-move", ({ roomId, x, y }) => {

    socket.to(roomId).emit("cursor-move", {
      id: socket.id,
      x,
      y
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

httpServer.listen(4000, () => {

  console.log("Socket server running on port 4000")
})