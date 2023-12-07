import { useCanister } from '@connect2ic/react';
import React, { useRef, useState, useEffect } from 'react';
import { FaBookOpen, FaSearch } from 'react-icons/fa';

const isClickInsideRectangle = (e, element) => {
  const r = element.getBoundingClientRect();

  return (
    e.clientX > r.left &&
    e.clientX < r.right &&
    e.clientY > r.top &&
    e.clientY < r.bottom
  )
}

function SearchDialog(params) {
  const ref = useRef(null)
  const [outcall] = useCanister("outcall")
  const { isOpened, onClose, setMedia } = params

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("Results will be shown here")

  useEffect(() => {
    if (isOpened) {
      ref.current?.showModal()
      document.body.classList.add("modal-open")
    } else {
      ref.current?.close()
      document.body.classList.remove("modal-open")
    }
  }, [isOpened])

  const handleSearch = async (e) => {
		e.preventDefault()
    setLoading(true)
		try {
			const list = await outcall.searchBook(searchQuery.trim().split(' '))
			const parsedList = JSON.parse(list)
      
      if(parsedList.docs.length == 0) {
        setMessage("Your search did not bring any results :( Try refining it!")
      }
      setSearchResult(parsedList.docs)
		} catch (e) {
			console.error(e)
      setMessage("There was an error. Try again later!")
		} finally {
      setLoading(false)
    }
	}

  const handleSelectMedia = (element) => {
    setMedia(element)
    onClose()
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
    <dialog ref={ref} onCancel={onClose}
      onClick={(e) => ref.current && !isClickInsideRectangle(e, ref.current) && onClose()} className='bg-slate-200 border border-purple-800 rounded-2xl p-4'>
      <div className='flex flex-col space-y-2 max-w-md'>
        <form onSubmit={handleSearch} className='flex flex-row space-x-4'>
          <div className='relative w-full'>
            <FaSearch className='absolute top-3.5 left-3 text-purple-800'/>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='border border-purple-800 rounded-xl w-full pr-2 py-2 pl-10 font-medium' placeholder='Search'/>
          </div>
          <button type='submit' disabled={loading} className='p-2 bg-slate-900 w-40 text-white font-medium rounded-xl'>
            {loading ? loadingSvg() : 'Search'}
          </button>
        </form>
        <div className='border-b border-purple-800 w-full'/>
        {searchResult.length === 0 && <div className='flex items-center justify-center h-40 w-full'>
          <p className='text-sm font-light text-slate-700'>{message}</p>
        </div>}
        <div className='space-y-1'>
        {searchResult.map((element, index) => {
          return(
            <div onClick={() => handleSelectMedia(element)} className='flex flex-row space-x-2 items-center cursor-pointer hover:bg-purple-300 hover:scale-105' key={element.key}>
              {element.cover_i ? <img src={`https://covers.openlibrary.org/b/id/${element.cover_i}-S.jpg`}/> : <div className='bg-slate-500 h-14 w-9 flex items-center justify-center text-slate-200'><FaBookOpen /></div>}
              <div className='flex flex-col space-y-1'>
                <p className='font-medium tracking-tight text-sm'>{element.title}</p>
                <p className='tracking-tight text-xs'>{element.author_name ? element.author_name[0] : "Uknown"}</p>
              </div>
            </div>
          )
          })}
        </div>
      </div>
    </dialog>
  );
}

export default SearchDialog;