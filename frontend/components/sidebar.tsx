export default function Sidebar() {
  return (
    <div className="flex flex-col space-y-6 w-52 h-full">
      <div className="flex items-center justify-center bg-gray-300 rounded-md h-52">
        Photo
      </div>
      <div className="flex flex-col items-center justify-start px-2 py-4 bg-purple-900 rounded-md min-h-screen">
        <p className="text-white text-center text-lg font-bold">
          CRISTINA LOUSTAUNAU
        </p>
        <p className="text-white font-light">@USER</p>
        <p className="text-white text-sm mt-8 text-center font-light">
          Descripción del perfil. Con quien quiero conectar
        </p>
        <p className="text-white text-sm mt-8 text-center">
          Quiero conectar con:
        </p>
        <ul className="text-white text-sm text-center font-light">
          <li>Part-Timers</li>
          <li>Web Devs</li>
          <li>Zelda Geeks</li>
        </ul>
        <p className="text-white text-sm mt-8 text-center">COMUNIDADES</p>
        <div className="w-full space-y-2 mt-2">
          <div className="flex flex-row items-center justify-between space-x-4">
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              A
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              B
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              C
            </div>
          </div>
          <div className="flex flex-row items-center justify-between space-x-4">
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              A
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              B
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              C
            </div>
          </div>
          <div className="flex flex-row items-center justify-between space-x-4">
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              A
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              B
            </div>
            <div className="flex bg-gray-400 rounded-full w-32 h-10 items-center justify-center">
              C
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
