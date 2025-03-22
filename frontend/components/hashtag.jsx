import React from "react"

export default function Hashtag({ name }) {
  return (
    <div className="flex px-3 h-5 rounded-2xl max-w-fit text-[10px] text-[#FDFCFF] font-normal bg-[#4F239E] items-center justify-center">
      #{name}
    </div>
  )
}
