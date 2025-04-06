// MenuButton.jsx
import { useEffect, useRef } from "react";

import { Link } from "react-router-dom";


export default function MenuButton({ spaceName, isOpen, onToggle }) {
  const dropdownRef = useRef();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(null);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3-Dot Menu Icon */}
      <button onClick={() => onToggle(isOpen ? null : spaceName)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-8 right-0 bg-gray-800 text-white rounded-lg shadow-lg w-48 z-10">
          <ul className="p-2 space-y-2 text-sm">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              {/* <a href={`/products/${spaceName}`}>Manage Testimonials</a> */}
              <Link to={`/products/${spaceName}`}>Manage Testimonials</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              Get the Link
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              Edit the Space
            </li>
            <li className="px-4 py-2 hover:bg-red-500 cursor-pointer">
              Delete the Space
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
