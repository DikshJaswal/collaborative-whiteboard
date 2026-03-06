"use client"

import { Tool } from "@/types/tool"
import ColorPicker from "./ColorPicker"

export default function Toolbar({
  tool,
  setTool,
  undo,
  redo,
  color,
  setColor
}:{
  tool:Tool
  setTool:(t:Tool)=>void
  undo:()=>void
  redo:()=>void
  color:string
  setColor:(c:string)=>void
}){

  return(

    <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white shadow rounded flex gap-2 p-2">

      <button onClick={()=>setTool("pen")}>✏️</button>
      <button onClick={()=>setTool("rectangle")}>⬛</button>
      <button onClick={()=>setTool("circle")}>⭕</button>
      <button onClick={()=>setTool("text")}>T</button>

      <ColorPicker
        color={color}
        setColor={setColor}
      />

      <button onClick={undo}>↩</button>
      <button onClick={redo}>↪</button>

    </div>

  )

}