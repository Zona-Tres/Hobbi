export default function Feed() {
  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Conexiones recientes... */}
      <div className="flex flex-col bg-purple-900 rounded-md p-4 w-full">
        <p className="text-white">Conexiones recientes</p>
        <div className="flex flex-row space-x-2 mt-2">
          <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
          <div className="h-20 w-20 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col bg-purple-900 rounded-md p-4 w-full space-y-4">
        <div className="flex flex-row w-full rounded-md p-2 bg-white space-x-2">
          <div className="h-10 w-10 bg-gray-400 rounded-md"></div>
          <p className="">New post</p>
        </div>

        <div className="flex flex-row w-full rounded-md p-2 bg-purple-300 space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="h-10 w-10 bg-gray-400 rounded-md"></div>
            <div className="flex flex-row justify-between">
              <div className="h-4 w-4 bg-blue-400 rounded-md"></div>
              <div className="h-4 w-4 bg-yellow-400 rounded-md"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">
              Cristina started playing Animal Crossing: New Horizons
            </p>
            <p className="text-sm">
              Me encanta! Pero no puedo conseguir hierro :c
            </p>
          </div>
        </div>

        <div className="flex flex-row w-full rounded-md p-2 bg-purple-300 space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="h-10 w-10 bg-gray-400 rounded-md"></div>
            <div className="flex flex-row justify-between">
              <div className="h-4 w-4 bg-blue-400 rounded-md"></div>
              <div className="h-4 w-4 bg-yellow-400 rounded-md"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Cristina finished Squid Games</p>
            <p className="text-sm">No se me ocurrio otra serie...</p>
          </div>
        </div>

        <div className="flex flex-row w-full rounded-md p-2 bg-purple-300 space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="h-10 w-10 bg-gray-400 rounded-md"></div>
            <div className="flex flex-row justify-between">
              <div className="h-4 w-4 bg-blue-400 rounded-md"></div>
              <div className="h-4 w-4 bg-yellow-400 rounded-md"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">
              Zin recommended you Octopath Traveler II
            </p>
            <p className="text-sm">Ochette best girl</p>
          </div>
        </div>
      </div>
    </div>
  )
}
