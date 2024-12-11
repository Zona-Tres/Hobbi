import React from "react";

export default function Hashtag({ name }) {
  return (
    <div className="flex px-2 h-5 rounded-2xl max-w-fit text-[10px] text-[#B577F7] font-normal bg-[#E1C9FB] items-center justify-center">
      #{name}
    </div>
  );
}