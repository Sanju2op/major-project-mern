import { useAuth, RedirectToSignIn, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = await getToken();
        const response = await axios.get("http://localhost:5000/api/spaces", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const plainSpaces = response.data.spaces.map((space) => ({
          _id: space._id,
          name: space.name,
          collectionType: space.collectionType,
          customMessage: space.customMessage,
          questions: space.questions,
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
    <div className="min-h-screen bg-black-900 text-white bg-gray-900">
      {/* App Bar */}
      <header className="bg-black-900 shadow-md py-6 px-16 flex justify-between items-center border-b border-gray-500">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <UserButton />
      </header>

      <main className="p-16">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-semibold mb-3">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <p className="text-gray-400">Total Spaces</p>
              <p className="text-2xl font-bold">{spaces.length}</p>
            </div>
          </div>
        </section>

        {/* Search & List Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold">Spaces</h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              + Create Space
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search testimonials by name, type, or keywords"
              className="w-full p-2 pl-4 border border-gray-600 rounded-lg bg-black text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <div
                  key={space._id}
                  className="bg-gray-900 p-4 rounded-lg shadow-md space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">{space.name}</p>
                    <button className="text-gray-400 hover:text-white">
                      ⋮
                    </button>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Type: {space.collectionType}</p>
                    <p>Created: {formatDate(space.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No spaces found matching your search.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
