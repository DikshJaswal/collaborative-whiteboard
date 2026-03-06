"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {

  const [roomId, setRoomId] = useState("")
  const router = useRouter()

  const createRoom = () => {
    const id = crypto.randomUUID()
    router.push(`/room/${id}`)
  }

  const joinRoom = () => {
    if (!roomId) return
    router.push(`/room/${roomId}`)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">

      <h1 className="text-3xl font-bold">
        Collaborative Whiteboard
      </h1>

      <button
        onClick={createRoom}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Create Room
      </button>

      <input
        className="border p-2"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button
        onClick={joinRoom}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Join Room
      </button>

    </div>
  )
}