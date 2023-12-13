import React, { useState, useEffect } from 'react';
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { FaBookOpen, FaGamepad } from "react-icons/fa";

function PostList(params) {
  const {postList, user} = params

  const readableDate = (timestamp) => {
    const timestampInMilliseconds = Number(timestamp) / 1e6;
    const date = new Date(timestampInMilliseconds);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);

    return formatted
  }

  if(postList.length == 0) {
    return <div className='w-full text-center'>Este usuario aún no ha posteado nada</div>
  }

  return (<div className="flex flex-col space-y-4 w-full">
    {
      Object.keys(postList).map(element => {
        const result = postList[element][1]
        return result
      }).sort((a, b) => Number(b.date) - Number(a.date)).map((element, index) => {
      const prog = Object.keys(element.metadata.progress)[0]
      const mType = Object.keys(element.metadata.media_type)[0]

      let data = {}
      switch(mType) {
        case "Book": data = {action: "leer", width: 80, icon: <FaBookOpen className='text-slate-400/70' width={40} height={40}/>}; break
        case "Tv": data = {action: "ver", width: 80, icon: <PiTelevisionSimpleFill className='text-slate-400/70' width={40} height={40}/>}; break
        case "Music": data = {action: "escuchar", width: 50}; break
        case "Game": data = {action: "jugar", width: 150, icon: <FaGamepad className='text-slate-400/70' width={40} height={40}/>}; break
      }

      return(
        <div key={element.id} className={`relative flex flex-col w-full border border-purple-800 rounded-2xl bg-gradient-to-br ${prog == "Started" ? `from-blue-200` : prog == "Finished" ? `from-emerald-400` :  `from-yellow-200`} via-slate-200 to-slate-200 py-3 px-4 space-y-2`}>
          <div className="flex flex-row space-x-4">
            <div className='overflow-hidden border border-purple-800 rounded-md'>
              <img src={element.metadata.image_url} width={data.width}/>
            </div>
            <div className="flex flex-col w-full space-y-1 justify-center">
              <p className="font-medium"><strong>{user}</strong> {prog == "Started" ? "empezó" : prog == "Finished" ? "terminó" : ("quiere " + data.action)} <strong>{element.metadata.title}</strong></p>
              <p className="text-xs">{readableDate(element.date)}</p>
              <p className="mt-2">{element.message}</p>
            </div>
          </div>
          <div className='absolute right-4 top-0'>{data.icon}</div>
        </div>
      )
    })}
  </div>)
}

export default PostList