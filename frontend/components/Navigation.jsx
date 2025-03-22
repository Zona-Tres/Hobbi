import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (path) => {
    navigate(path)
  }

  const menuItems = [
    {
      path: "/feed",
      name: "Inicio",
      icon: (
        <path
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      ),
    },
    {
      path: "/feed",
      name: "Feed",
      icon: (
        <path
          d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      ),
    },
    {
      path: "/friends",
      name: "Contacts",
      icon: (
        <path
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      ),
    },
    {
      path: "/communities",
      name: "Communities",
      icon: (
        <path
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4 ml-5 mt-8">
      {menuItems.map((item) => (
        <div
          key={item.path + item.name}
          className="flex gap-4 hover:cursor-pointer"
          onClick={() => handleClick(item.path)}
        >
          <div
            className={`flex items-center justify-center h-6 w-6 rounded-md ${
              location.pathname === item.path ? "bg-[#B577F7]" : "bg-[#0E1425]"
            }`}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-[#505CE6]"
              }`}
            >
              {item.icon}
            </svg>
          </div>
          <span
            className={`text-base font-bold ${
              location.pathname === item.path
                ? "text-[#B577F7]"
                : "text-[#505CE6]"
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  )
}
