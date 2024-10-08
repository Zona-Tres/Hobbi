import React from "react";

export default function Hashtag({ name }) {
  return (
    <div className="flex px-2 h-5 rounded-2xl max-w-fit text-[10px] text-[#F7EFFF] font-normal bg-[#4F239E] align-middle">
      {name}
    </div>
  );
}
