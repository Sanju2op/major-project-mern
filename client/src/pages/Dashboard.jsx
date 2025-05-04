import { useAuth, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import SpaceForm from "../components/SpaceForm";
import MenuButton from "../components/MenuButton";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export default function Dashboard() {
  const { isLoaded, userId, getToken } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuSpace, setOpenMenuSpace] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/testimonials/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchStats();
  }, [userId, getToken]); 
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = await getToken();
        // console.log(token);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/spaces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const plainSpaces = response.data.spaces.map((space) => ({
          _id: space._id,
          name: space.name,
          headerTitle: space.headerTitle,
          collectionType: space.collectionType,
          customMessage: space.customMessage,
          questions: space.questions,
          slug: space.slug,
          createdAt: space.createdAt,
        }));

        setSpaces(plainSpaces);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSpaces();
  }, [userId, getToken]);

  const handleCreateSuccess = (newSpace) => {
    // Add the new space to the spaces array
    setSpaces([newSpace, ...spaces]);
    // Close the modal
    setShowCreateModal(false);
  };

  const handleSpaceClick = (spaceId) => {
    // Redirect to space details/manage page
    // You can implement this functionality when needed
    // console.log("Clicked on space:", spaceId);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <RedirectToSignIn />;
  if (loading)
    return <div className="p-32 text-white text-xl">Loading Dashboard...</div>;

  const filteredSpaces = spaces.filter((space) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      space.name.toLowerCase().includes(searchLower) ||
      space.collectionType.toLowerCase().includes(searchLower) ||
      space.customMessage?.toLowerCase().includes(searchLower) ||
      space.questions.some((q) => q.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* App Bar */}
      <header className="bg-black shadow-md py-6 px-16 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <UserButton />
      </header>

      <main className="p-16">
        {/* Overview Section */}
        <section className="mb-16 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 mb-2">Total Spaces</p>
              <p className="text-3xl font-bold">{spaces.length}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 mb-2">Total Testimonials</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <p className="text-gray-300 mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </section>

        {/* Search & List Section */}
        <section className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Spaces</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
              + Create Space
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search testimonials by name, type, or keywords"
              className="w-full p-3 pl-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <div
                  key={space._id}
                  onClick={() => handleSpaceClick(space._id)}
                  className="bg-gray-700 p-6 rounded-lg shadow-md space-y-4 cursor-pointer hover:bg-gray-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-xl">{space.name}</p>
                    {/* <button
                      className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add dropdown menu functionality here
                      }}>
                      ⋮
                    </button> */}
                    <MenuButton
                      spaceData={space}
                      isOpen={openMenuSpace === space.name}
                      onToggle={(name) => setOpenMenuSpace(name)}
                      onUpdateSuccess={(updatedSpace) => {
                        setSpaces((prev) =>
                          prev.map((s) => (s._id === updatedSpace._id ? updatedSpace : s))
                        );
                      }}
                      onDeleteSuccess={(deletedId) => {
                        setSpaces((prev) => prev.filter((s) => s._id !== deletedId));
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-gray-300 mb-1">Type: {space.collectionType}</p>
                    <p className="text-gray-300">Created: {formatDate(space.createdAt)}</p>
                  </div>

                  {/* <div className="pt-2 border-t border-gray-600 flex justify-between items-center"> */}
                    {/* <span className="text-gray-300">0 testimonials</span> */}
                    {/* <button
                      className="text-blue-400 hover:text-blue-300 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add view testimonials functionality
                      }}>
                      View
                    </button> */}
                  {/* </div> */}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-12">
                No spaces found matching your search.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Create Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-700 p-6">
              <h3 className="text-xl font-semibold">Create New Space</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <SpaceForm onSuccess={handleCreateSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}