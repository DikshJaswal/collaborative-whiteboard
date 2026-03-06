"use client"

import { useEffect } from "react"
import { socket } from "@/lib/socket"

export default function useSocket() {

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected:", socket.id)
    })

    return () => {
      socket.off("connect")
    }

  }, [])

  return socket
}