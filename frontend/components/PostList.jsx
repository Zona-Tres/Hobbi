import React, { useState, useEffect } from 'react';

function PostList(params) {
  const {postList, user} = params

  const readableDate = (timestamp) => {
    const timestampInMilliseconds = Number(timestamp) / 1e6;
    const date = new Date(timestampInMilliseconds);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);

    return formatted
  }

  return (<div className="flex flex-col space-y-4 w-full">
    {Object.keys(postList).map((element, index) => {
      const prog = Object.keys(postList[element][1].metadata.progress)[0]
      const mType = Object.keys(postList[element][1].metadata.media_type)[0]

      let action = ""
      switch(mType) {
        case "Book": action = "leer"; break
        case "Tv": action = "ver"; break
        case "Music": action = "escuchar"; break
        case "Game": action = "jugar"; break
      }

      return(
        <div key={postList[element][0]} className={`flex flex-col w-full border border-purple-800 rounded-2xl bg-gradient-to-br ${prog == "Started" ? `from-blue-200` : prog == "Finished" ? `from-emerald-400` :  `from-yellow-200`} via-slate-200 to-slate-200 py-3 px-4 space-y-2`}>
          <div className="flex flex-row space-x-2">
            <div className='overflow-hidden border border-purple-800 rounded-md'>
              <img src={postList[element][1].metadata.image_url} width={50}/>
            </div>
            <div className="w-full space-y-1">
              <p className="font-medium"><strong>{user}</strong> {prog == "Started" ? "empezó" : prog == "Finished" ? "terminó" : ("quiere " + action)} <strong>{postList[element][1].metadata.title}</strong></p>
              <p className="text-xs">{readableDate(postList[element][1].date)}</p>
              <p className="mt-2">{postList[element][1].message}</p>
            </div>
          </div>
        </div>
      )
    })}
  </div>)
}

export default PostList