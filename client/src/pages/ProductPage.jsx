import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import SpaceForm from "../components/SpaceForm";
import axios from "axios";

export default function ProductPage() {
  const { isLoaded, getToken } = useAuth();
  const { spaceName } = useParams();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 New: Modal control
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const token = await getToken();

        const res = await axios.get(`http://localhost:5000/api/spaces/${spaceName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setSpace(res.data.space);
      } catch (error) {
        console.error(
          "Error fetching space:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (spaceName && isLoaded) fetchSpace();
  }, [spaceName, isLoaded, getToken]);

  // 🔥 New: update space after editing
  const handleSpaceUpdate = (updatedSpace) => {
    setSpace(updatedSpace);
    setShowEditModal(false);
    alert("Space updated successfully!");
  };

  if (loading) {
    return <div className="p-16 text-white">Loading...</div>;
  }

  if (!space) {
    return <div className="p-16 text-red-400">Space not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ✅ App Bar */}
      <header className="bg-black shadow-md py-6 px-16 flex justify-between items-center border-b border-gray-500">
        <h1 className="text-2xl text-white font-bold">Testimonials</h1>
        <UserButton />
      </header>

      {/* ✅ Testimonials Summary */}
      <section className="w-full px-16 py-6 flex items-center space-x-6 border-b border-gray-500">
        {/* Logo */}
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>

        {/* Info */}
        <div>
          <h2 className="text-xl font-semibold">{space.name}</h2>
          <div className="text-gray-400 text-sm flex space-x-4 mt-1">
            <p>
              Video Credits: <strong>5</strong>
            </p>
            <p>
              Text Credits: <strong>10</strong>
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          className="ml-auto px-4 py-2 bg-white text-black rounded-md"
          onClick={() => setShowEditModal(true)}
        >
          Edit Space
        </button>
      </section>

      {/* ✅ Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-600 min-h-screen p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Inbox</h3>
            <ul className="space-y-2">
              <li className="p-2 bg-gray-700 rounded-md cursor-pointer">All</li>
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">Video</li>
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">Text</li>
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">Liked</li>
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">Archived</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="mt-6">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="text-lg font-semibold text-gray-300">Social Media</h3>
              <span className="text-gray-400">▼</span>
            </div>
            <ul className="space-y-2 mt-2">
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">YouTube</li>
              <li className="p-2 hover:bg-gray-700 rounded-md cursor-pointer">Twitter</li>
            </ul>
          </div>
        </aside>

        {/* Right Panel */}
        <main className="flex-1 p-8">
          <div className="text-center text-gray-400">
            <p className="text-lg">No testimonials yet</p>
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              <span>➕</span>
              <span>Add a Video</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
              <span>📝</span>
              <span>Add a Text</span>
            </button>
          </div>
        </main>
      </div>

      {/* 🔥 Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-6">
              <h3 className="text-xl font-semibold">Edit Space</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <SpaceForm space={space} onSuccess={handleSpaceUpdate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
