import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import SpaceForm from "./SpaceForm";

export default function MenuButton({ spaceData, isOpen, onToggle, onUpdateSuccess, onDeleteSuccess }) {
  const dropdownRef = useRef();
  const [showEditModal, setShowEditModal] = useState(false);
  const { getToken } = useAuth();

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

  const handleSuccess = (updatedSpace) => {
    alert("Space updated successfully!");
    onUpdateSuccess?.(updatedSpace); // Update parent state
    setShowEditModal(false);
  };

  const handleCopyLink = () => {
    const fullUrl = `${process.env.REACT_APP_FRONTEND_URL}/${spaceData.slug}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        alert("Failed to copy link.");
      });
  };


  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this space?");
    if (!confirm) return;

    try {
      const token = await getToken();
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/spaces/${spaceData._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Space deleted!");
      onDeleteSuccess?.(spaceData._id); // Inform parent to remove it
    } catch (err) {
      console.error("Error deleting space:", err);
      alert("Failed to delete space.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 3-dot icon */}
      <button onClick={() => onToggle(isOpen ? null : spaceData.name)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-8 right-0 bg-gray-800 text-white rounded-lg shadow-lg w-48 z-10">
          <ul className="p-2 space-y-2 text-sm">
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
              <Link to={`/products/${spaceData.slug}`}>Manage Testimonials</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={handleCopyLink}
            >
              Get the Link
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => setShowEditModal(true)}
            >
              Edit the Space
            </li>
            <li className="px-4 py-2 hover:bg-red-500 cursor-pointer"
              onClick={handleDelete}
            >
              Delete the Space
            </li>
          </ul>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-6">
              <h3 className="text-xl font-semibold">Edit Space</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <SpaceForm space={spaceData} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
