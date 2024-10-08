import React from "react"

export default function ItemInfo({ img, title, comments, hashtags }) {
  return (
    <div className="flex h-[67px] mt-2 pl-2 gap-2 rounded-lg bg-[#0E1425] border border-[#224E75] items-center">
      <img src={img}  />
      <div className="flex flex-col">
        <span className="text-sm text-[#F7EFFF] font-bold">{title}</span>
        <span className="text-xs text-[#BCBCBC] font-medium">{comments}</span>
        <div className="flex px-2 h-5 rounded-2xl max-w-fit text-[10px] text-[#F7EFFF] font-normal bg-[#121D2F] items-center">
          {hashtags}
        </div>
      </div>
    </div>
  )
}
