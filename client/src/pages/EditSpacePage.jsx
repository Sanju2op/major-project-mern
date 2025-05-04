// pages/EditSpacePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import SpaceForm from "../components/SpaceForm";

export default function EditSpacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`http://localhost:5000/api/spaces/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSpace(response.data.space);
      } catch (err) {
        console.error("Error fetching space:", err);
        setError("Failed to load space data");
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [id, getToken]);

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  if (loading) return <div className="p-32 text-white text-xl">Loading...</div>;
  if (error) return <div className="p-32 text-red-500 text-xl">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Space</h1>
        <SpaceForm space={space} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}