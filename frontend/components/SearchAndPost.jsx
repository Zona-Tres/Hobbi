import React, {useState} from 'react';

import { nanoid } from 'nanoid'
import SearchDialog from './SearchDialog';
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { FaBookOpen, FaGamepad, FaRegTimesCircle } from "react-icons/fa";
import { useCanister, useConnect } from '@connect2ic/react';

const BUTTON_CLASS = "btn-sm w-full px-4 py-2 text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none hover:scale-110"

function SearchAndPost(params) {
  const {setPostList} = params
  const {principal} = useConnect()
  const [post] = useCanister("post")
  const [media, setMedia] = useState(null)
  const [mediaType, setMediaType] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState('1')
  const [isOpened, setIsOpened] = useState(true)
  const [textAreaValue, setTextAreaValue] = useState("")

  const handleButtonClick = (selected) => {
    setMediaType(selected)
    setIsOpened(true)
  }

  const handlePost = async () => {
    setLoading(true)
    
    let prog = {}
    switch(selection) {
      case '1': prog = {Interested: null}; break
      case '2': prog = {Started: null}; break
      case '3': prog = {Finished: null}; break
    }

    let mType = {}
    switch(mediaType) {
      case 1: mType = {Book: null}; break
      case 2: mType = {Tv: null}; break
      case 3: mType = {Music: null}; break
      case 4: mType = {Game: null}; break
    }

    const postMetadata = {
      title: media.title,
      autor: media.sub ? media.sub : "Uknown",
      image_url: media.image,
      progress: prog,
      media_type: mType,
    }

    try {
      await post.createPost(nanoid(), textAreaValue, postMetadata)
      setMedia(null)

      await post.getUserPosts(principal).then((vec) => {
        setPostList(vec)
      })

    } catch(error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadingSvg = () => {
    return (
      <svg className="inline w-6 h-6 text-gray-200 animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    )
  }

  return (
    <div className="w-full py-2 px-4 rounded-2xl space-y-3 bg-slate-200">
      {/* Title and animation */}
     
      <div className="border-b border-slate-400" />
      <SearchDialog isOpened={true} setMedia={setMedia} mediaType={mediaType}/>
      {media ?
      <div className='flex flex-col w-full space-y-2'>
        <div className='w-full space-y-2'>
          <p className='font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900'>Selected media:</p>
          <div className='flex flex-row items-center justify-between bg-purple-300 rounded-lg py-2 px-4'>
            <div className='flex flex-row items-center space-x-2'>
              {media.image ? <img width={40} src={media.image}/> : <div className='bg-slate-500 h-14 w-9 flex items-center justify-center text-slate-200'></div>}
              <div className='flex flex-col space-y-1'>
                <p className='font-medium tracking-tight text-sm'>{media.title}</p>
                <p className='tracking-tight text-xs'>{media.sub}</p>
              </div>
            </div>
            <button className='hover:scale-110' onClick={() => setMedia(null)}>
              <FaRegTimesCircle className='text-red-800 hover:text-red-700'/>
            </button>
          </div>
        </div>
        <div className='flex flex-col space-y-2'>
          <label className='font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-slate-900'>Tell us what you thought of it:</label>
          <textarea value={textAreaValue} onChange={(e) => setTextAreaValue(e.target.value)} className='border border-purple-800 rounded-2xl w-full p-2 font-medium' />
        </div>
        <div className='flex w-full items-center justify-center'>
          <button onClick={handlePost} disabled={loading} className="btn-sm w-60 px-4 py-2 text-slate-300 hover:text-white transition duration-150 ease-in-out group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
            {loading ? loadingSvg() : 
              <span className="relative inline-flex items-center text-xl">
                <svg className="shrink-0 fill-slate-300 mr-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path d="m1.999 0 1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 0l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM11.999 10l1 2-1 2 2-1 2 1-1-2 1-2-2 1zM6.292 7.586l2.646-2.647L11.06 7.06 8.413 9.707zM0 13.878l5.586-5.586 2.122 2.121L2.12 16z" />
                </svg>
                Post
              </span>
            }
          </button>
        </div>
      </div>
      :
      <div className='flex space-x-4 w-full'>
      </div>}
    </div>
  );
}

export default SearchAndPost;