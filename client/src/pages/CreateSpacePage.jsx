// pages/CreateSpacePage.jsx
import { useNavigate } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";

export default function CreateSpacePage() {
  const navigate = useNavigate();

  const handleSuccess = (space) => {
    // Redirect to dashboard or space detail page
    alert("New space Created!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Space</h1>
        <SpaceForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}