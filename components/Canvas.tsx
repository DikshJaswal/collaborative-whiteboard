"use client"

import { useEffect, useRef, useState } from "react"
import { Stroke, Point } from "@/types/drawing"
import useSocket from "@/hooks/useSocket"

export default function Canvas({ roomId }: { roomId: string }) {

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const socket = useSocket()

  const [cursors, setCursors] = useState<Record<string, Point>>({})

  const strokesRef = useRef<Stroke[]>([])
  const undoStack = useRef<Stroke[]>([])
  const redoStack = useRef<Stroke[]>([])

  const currentStroke = useRef<Stroke | null>(null)

  const renderRef = useRef<() => void>(() => {})

  useEffect(() => {

    if (!roomId) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.lineCap = "round"

    const drawStroke = (stroke: Stroke | null) => {

      if (!stroke) return
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i]
        ctx.lineTo(p.x, p.y)
      }

      ctx.stroke()
    }

    const render = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      strokesRef.current.forEach(drawStroke)

      drawStroke(currentStroke.current)
    }

    renderRef.current = render

    const getPoint = (e: MouseEvent): Point => ({
      x: e.clientX,
      y: e.clientY
    })

    const handleMouseDown = (e: MouseEvent) => {

      currentStroke.current = {
        id: crypto.randomUUID(),
        color: "black",
        width: 3,
        points: [getPoint(e)]
      }
    }

    const handleMouseMove = (e: MouseEvent) => {

      if (currentStroke.current) {
        currentStroke.current.points.push(getPoint(e))
        render()
      }

      socket.emit("cursor-move", {
        roomId,
        x: e.clientX,
        y: e.clientY
      })
    }

    const handleMouseUp = () => {

      if (!currentStroke.current) return

      undoStack.current.push(currentStroke.current)
      redoStack.current = []

      strokesRef.current = [...undoStack.current]

      socket.emit("draw", {
        roomId,
        stroke: currentStroke.current
      })

      currentStroke.current = null

      render()
    }

    const undo = () => {

      const stroke = undoStack.current.pop()

      if (!stroke) return

      redoStack.current.push(stroke)

      strokesRef.current = [...undoStack.current]

      render()

      socket.emit("undo", { roomId })
    }

    const redo = () => {

      const stroke = redoStack.current.pop()

      if (!stroke) return

      undoStack.current.push(stroke)

      strokesRef.current = [...undoStack.current]

      render()

      socket.emit("redo", { roomId, stroke })
    }

    window.addEventListener("keydown", (e) => {

      if (e.ctrlKey && e.key === "z") undo()

      if (e.ctrlKey && e.key === "y") redo()
    })

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    socket.emit("join-room", roomId)

    socket.on("board-state", (serverStrokes: Stroke[]) => {

      strokesRef.current = serverStrokes

      undoStack.current = [...serverStrokes]

      render()
    })

    socket.on("draw", (stroke: Stroke) => {

      undoStack.current.push(stroke)

      strokesRef.current = [...undoStack.current]

      render()
    })

    socket.on("undo", () => {

      undoStack.current.pop()

      strokesRef.current = [...undoStack.current]

      render()
    })

    socket.on("redo", (stroke: Stroke) => {

      undoStack.current.push(stroke)

      strokesRef.current = [...undoStack.current]

      render()
    })

    socket.on("cursor-move", ({ id, x, y }) => {

      setCursors(prev => ({
        ...prev,
        [id]: { x, y }
      }))
    })

    render()

    return () => {

      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)

      socket.off("draw")
      socket.off("undo")
      socket.off("redo")
      socket.off("cursor-move")
    }

  }, [roomId, socket])

  return (
    <div className="w-screen h-screen relative">

      <canvas ref={canvasRef} className="bg-white" />

      {Object.entries(cursors).map(([id, pos]) => (

        <div
          key={id}
          className="absolute pointer-events-none"
          style={{ left: pos.x, top: pos.y }}
        >
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>

      ))}

    </div>
  )
}