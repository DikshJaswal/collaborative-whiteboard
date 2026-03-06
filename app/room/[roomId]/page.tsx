"use client"

import { useParams } from "next/navigation"
import Canvas from "@/components/Canvas"

export default function RoomPage() {

  const params = useParams()

  const roomId =
    typeof params.roomId === "string" ? params.roomId : ""

  return (
    <div className="w-screen h-screen">
      <Canvas roomId={roomId} />
    </div>
  )
}