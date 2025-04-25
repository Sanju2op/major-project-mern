import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import SpaceForm from "../components/SpaceForm";
import axios from "axios";
import { FaTwitter, FaInstagram, FaCode } from "react-icons/fa";

export default function ProductPage() {
  const { isLoaded, getToken } = useAuth();
  const { spaceName } = useParams();
  const [space, setSpace] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:5000/api/spaces/${spaceName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setSpace(res.data.space);
      } catch (error) {
        console.error("Error fetching space:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (spaceName && isLoaded) fetchSpace();
  }, [spaceName, isLoaded, getToken]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:5000/api/testimonials/space/${space._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setTestimonials(res.data.testimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error.response?.data || error.message);
      }
    };

    if (space && isLoaded) fetchTestimonials();
  }, [space, isLoaded, getToken]);

  const handleSpaceUpdate = (updatedSpace) => {
    setSpace(updatedSpace);
    setShowEditModal(false);
    alert("Space updated successfully!");
  };

  // ✅ Approve / Reject handlers
  const handleApprove = async (testimonialId) => {
    try {
      const token = await getToken();
      await axios.patch(
        `http://localhost:5000/api/testimonials/${testimonialId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === testimonialId ? { ...t, status: "approved" } : t))
      );
    } catch (err) {
      console.error("Error approving testimonial:", err.response?.data || err.message);
    }
  };

  const handleReject = async (testimonialId) => {
    try {
      const token = await getToken();
      await axios.patch(
        `http://localhost:5000/api/testimonials/${testimonialId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === testimonialId ? { ...t, status: "rejected" } : t))
      );
    } catch (err) {
      console.error("Error rejecting testimonial:", err.response?.data || err.message);
    }
  };

  const generateEmbedScript = () => {
    const script = `<script src="${window.location.origin}/api/embed/${space._id}" async></script>`;
    return script;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Script copied to clipboard!");
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "all") return true;
    if (filter === "approved") return t.status === "approved";
    if (filter === "pending") return t.status === "pending";
    if (filter === "rejected") return t.status === "rejected";
    return true;
  });

  if (loading) return <div className="p-16 text-white">Loading...</div>;
  if (!space) return <div className="p-16 text-red-400">Space not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-black shadow-md py-6 px-16 flex justify-between items-center border-b border-gray-500">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowScriptModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <FaCode />
            <span>Get Embed Code</span>
          </button>
          <UserButton />
        </div>
      </header>

      {/* Summary */}
      <section className="w-full px-16 py-6 flex items-center space-x-6 border-b border-gray-500">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <h2 className="text-xl font-semibold">{space.name}</h2>
          <div className="text-gray-400 text-sm flex space-x-4 mt-1">
            <p>
              Text Credits: <strong>10</strong>
            </p>
          </div>
        </div>
        <button
          className="ml-auto px-4 py-2 bg-white text-black rounded-md"
          onClick={() => setShowEditModal(true)}
        >
          Edit Space
        </button>
      </section>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-600 min-h-screen p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Filters</h3>
            <ul className="space-y-2">
              <li
                className={`p-2 rounded-md cursor-pointer ${filter === "all" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => setFilter("all")}
              >
                All
              </li>
              <li
                className={`p-2 rounded-md cursor-pointer ${filter === "approved" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => setFilter("approved")}
              >
                Approved
              </li>
              <li
                className={`p-2 rounded-md cursor-pointer ${filter === "pending" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </li>
              <li
                className={`p-2 rounded-md cursor-pointer ${filter === "rejected" ? "bg-gray-700" : "hover:bg-gray-700"}`}
                onClick={() => setFilter("rejected")}
              >
                Rejected
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-8">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center text-gray-400">
              <p className="text-lg">No testimonials yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredTestimonials.map((t) => (
                <div key={t._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={
                        t.author.avatar ||
                        "https://placehold.jp/34/3d4070/ffffff/150x150.png?text=Not%20Uploaded"
                      }
                      alt={t.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-semibold">{t.author.name}</h4>
                      <p className="text-sm text-gray-400">{t.author.company}</p>
                    </div>
                  </div>

                  {t.rating && <p className="mb-2 text-yellow-400">⭐ {t.rating}/5</p>}
                  <p className="text-gray-300 mb-2">{t.content}</p>

                  {t.answers?.length > 0 && (
                    <div className="mt-4 space-y-2 text-sm text-gray-400">
                      {t.answers.map((a, i) => (
                        <div key={i}>
                          <p className="font-semibold">{a.question}</p>
                          <p>{a.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Social Media Links */}
                  {(t.socialLinks?.twitter || t.socialLinks?.instagram) && (
                    <div className="mt-4 flex space-x-3">
                      {t.socialLinks.twitter && (
                        <a
                          href={t.socialLinks.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaTwitter className="w-5 h-5" />
                        </a>
                      )}
                      {t.socialLinks.instagram && (
                        <a
                          href={t.socialLinks.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-400 hover:text-pink-300"
                        >
                          <FaInstagram className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Moderation buttons */}
                  {t.status === "pending" && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleApprove(t._id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(t._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {t.status !== "pending" && (
                    <div className="mt-4 text-sm text-gray-400">
                      Status:{" "}
                      <span className={t.status === "approved" ? "text-green-400" : "text-red-400"}>
                        {t.status}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center space-x-4 mt-10">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
              <span>📝</span>
              <span>Add a Text</span>
            </button>
          </div>
        </main>
      </div>

      {/* Script Modal */}
      {showScriptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Embed Code</h3>
            <div className="bg-gray-900 p-4 rounded-md mb-4 overflow-auto">
              <code className="text-sm text-gray-300 break-words whitespace-pre-wrap">
                {generateEmbedScript()}
              </code>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowScriptModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Close
              </button>
              <button
                onClick={() => copyToClipboard(generateEmbedScript())}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <SpaceForm
          space={space}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleSpaceUpdate}
        />
      )}
    </div>
  );
}
