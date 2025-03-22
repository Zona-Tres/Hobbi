import { nanoid } from "nanoid"
import React, { useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import _ from "lodash"

const TMDB_API_KEY = "07c722be608351326cd7820c8e4a6551"
const TMDB_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2M3MjJiZTYwODM1MTMyNmNkNzgyMGM4ZTRhNjU1MSIsInN1YiI6IjY1NzEzYjkyZGZlMzFkMDBlMGRhNDkxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6TkvC97Gbfl8tzXA3Krv44GzHkE8BkovbGKaY_jcVIA"
const RAWG_API_KEY = "c542e67aec3a4340908f9de9e86038af"

function SearchDialog(params) {
  const ref = useRef(null)
  const { isOpened, onClose, setMedia, mediaType, selectedTheme } = params

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("Results will be shown here")

  const debounceTimeout = useRef()

  const handleInputChange = (e) => {
    clearTimeout(debounceTimeout.current)
    setSearchQuery(e.target.value)

    debounceTimeout.current = setTimeout(() => {
      handleSearch()
    }, 500)
  }

  const searchBook = async (query) => {
    const url = `https://openlibrary.org/search.json?q=${query}&_spellcheck_count=0&limit=10&fields=key,cover_i,title,subtitle,author_name,name&mode=everything`
    const response = await fetch(url)
    const data = await response.json()

    if (data.docs.length > 0) {
      return data.docs.map((element) => ({
        title: element.title || "Unknown",
        sub: element.author_name?.[0] || "Unknown",
        image: element.cover_i
          ? `https://covers.openlibrary.org/b/id/${element.cover_i}-M.jpg`
          : null,
      }))
    }
    return []
  }

  const searchTv = async (query) => {
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`
    const response = await fetch(url, {
      headers: {
        Authorization: import.meta.env.VITE_TMDB_TOKEN,
      },
    })
    const data = await response.json()

    if (data.results.length > 0) {
      return data.results.map((element) => ({
        title: element.title || element.name || "Unknown",
        sub: element.release_date || element.first_air_date || "TBR",
        image: element.poster_path
          ? `https://image.tmdb.org/t/p/w500${element.poster_path}`
          : element.backdrop_path
            ? `https://image.tmdb.org/t/p/w500${element.backdrop_path}`
            : null,
      }))
    }
    return []
  }

  const searchGame = async (query) => {
    const url = `https://rawg.io/api/search?search=${query}&page_size=10&page=1&key=${import.meta.env.VITE_RAWG_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.results.length > 0) {
      return data.results.map((element) => ({
        title: element.name || "Unknown",
        sub: element.released || "TBR",
        image: element.background_image || null,
      }))
    }
    return []
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setMessage("Results will be shown here")
    setSearchResult([])

    try {
      const query = encodeURIComponent(searchQuery.trim())
      let results = []

      switch (mediaType) {
        case 1: // Libros
          results = await searchBook(query)
          break
        case 2: // TV Shows
          results = await searchTv(query)
          break
        case 3: // Videojuegos
          results = await searchGame(query)
          break
      }

      setSearchResult(results)
      if (results.length === 0) {
        setMessage("Your search did not bring any results :( Try refining it!")
      }
    } catch (e) {
      setMessage("There was an error. Try again later!")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMedia = (element) => {
    setMedia(element)
    setSearchResult([])
    setSearchQuery("")
  }

  const loadingSvg = () => (
    <svg
      className="inline w-6 h-6 text-gray-200 animate-spin fill-purple-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="https://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  )
  return (
    <div className="flex flex-col w-full" style={{ position: "relative" }}>
      {/* Input de búsqueda */}
      <div className="relative w-full">
        <input
          value={searchQuery}
          onChange={handleInputChange}
          className="border border-purple-800 rounded-xl w-full pr-10 py-2 pl-3 font-medium"
          placeholder="Search"
        />
        <FaSearch className="absolute top-3.5 right-3 text-purple-800" />
      </div>

      {/* Contenedor flotante para resultados */}
      <div
        className="absolute top-full left-0 right-0 z-50 bg-white shadow-lg border border-purple-800 rounded-xl mt-2"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-4">
            {loadingSvg()}
          </div>
        )}
        {searchResult.length === 0 && !loading ? (
          <></>
        ) : (
          searchResult.map((element) => (
            <div
              onClick={() => handleSelectMedia(element)}
              className="flex flex-row space-x-2 items-center cursor-pointer hover:bg-purple-300 hover:scale-105 bg-[#FFFFFF] px-4 py-2"
              key={nanoid()}
            >
              {element.image ? (
                <img width={30} src={element.image} alt="media" />
              ) : (
                <div className="bg-slate-500 h-14 w-9 flex items-center justify-center text-slate-200" />
              )}
              <div className="flex flex-col space-y-1">
                <p className="font-medium tracking-tight text-sm">
                  {element.title}
                </p>
                <p className="tracking-tight text-xs">{element.sub}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SearchDialog
