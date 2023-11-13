export default function Searchbar() {
  return (
    <div className="flex flex-row space-x-6">
        <div className="flex items-center justify-center bg-gray-300 rounded-md px-4 py-2">Inicio</div>
        <div className="flex w-full items-center justify-center bg-gray-300 rounded-md px-4 py-2">Search</div>
        <div className="flex items-center justify-center bg-purple-800 text-white rounded-md px-4 py-2">Comunidades</div>
    </div>
  )
}