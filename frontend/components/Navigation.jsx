import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  const menuItems = [
    {
      path: "/feed",
      name: "Inicio",
      icon: (
        <path
          d="M0.6875 8.00012L7.40338 1.28424C7.73288 0.954733 8.26712 0.954733 8.59662 1.28424L15.3125 8.00012M2.375 6.31262V13.9064C2.375 14.3724 2.75276 14.7501 3.21875 14.7501H6.3125V11.0939C6.3125 10.6279 6.69026 10.2501 7.15625 10.2501H8.84375C9.30974 10.2501 9.6875 10.6279 9.6875 11.0939V14.7501H12.7812C13.2472 14.7501 13.625 14.3724 13.625 13.9064V6.31262M5.1875 14.7501H11.375"
        />
      ),
    },
    {
      path: "/feed",
      name: "Feed",
      icon: (
        <path
          d="M14 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0ZM14 14H2V2H14V14ZM4 7H12V9H4V7ZM4 4H12V6H4V4ZM4 10H8V12H4V10Z"
        />
      ),
    },
    {
      path: "/friends",
      name: "Contactos",
      icon: (
        <path
          d="M8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0ZM8 6C6.9 6 6 5.1 6 4C6 2.9 6.9 2 8 2C9.1 2 10 2.9 10 4C10 5.1 9.1 6 8 6ZM16 14V16H0V14C0 11.8 4.7 10 8 10C11.3 10 16 11.8 16 14ZM14 14C14 13.4 11.1 12 8 12C4.9 12 2 13.4 2 14H14Z"
        />
      ),
    },
    {
      path: "/communities",
      name: "Comunidades",
      icon: (
        <path
          d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14ZM9 4H7V9H12V7H9V4Z"
        />
      ),
    },
  ];

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
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
  );
} 