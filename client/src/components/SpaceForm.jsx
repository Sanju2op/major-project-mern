// components/SpaceForm.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function SpaceForm({ space = null, onSuccess }) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [spaceName, setSpaceName] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [questions, setQuestions] = useState([
    "Who are you / what are you working on?",
    "How has [our product / service] helped you?",
    "What is the best thing about [our product / service]?",
  ]);
  const [collectionType, setCollectionType] = useState("Text only");
  const [starRatings, setStarRatings] = useState(true);

  // If space is provided, fill form with existing data
  useEffect(() => {
    if (space) {
      setSpaceName(space.name || "");
      setHeaderTitle(space.headerTitle || "");
      setCustomMessage(space.customMessage || "");
      setQuestions(space.questions || []);
      setCollectionType(space.collectionType || "Text only");
      setStarRatings(space.starRatings !== undefined ? space.starRatings : true);
    }
  }, [space]);

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, ""]);
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Add a function to generate a slug from the space name
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Add a function to check for duplicate slugs
  const checkDuplicateSlug = async (slug) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/spaces/check-slug/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.exists;
    } catch (err) {
      console.error("Error checking slug:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = await getToken();
      let slug = generateSlug(spaceName);
      let duplicate = await checkDuplicateSlug(slug);
      let counter = 1;

      // If duplicate, modify the slug
      while (duplicate) {
        slug = `${generateSlug(spaceName)}${counter}`;
        duplicate = await checkDuplicateSlug(slug);
        counter++;
      }

      const url = space
        ? `${process.env.REACT_APP_API_URL}/api/spaces/${space._id}`
        : `${process.env.REACT_APP_API_URL}/api/spaces`;

      const method = space ? "put" : "post";

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          name: spaceName,
          slug, // Include the slug in the data
          headerTitle,
          customMessage,
          questions,
          collectionType,
          starRatings,
        },
      });

      console.log(`✅ Space ${space ? "updated" : "created"}:`, response.data);

      // Call the success callback
      if (onSuccess) {
        onSuccess(response.data.space);
      }
    } catch (err) {
      console.error("🚨 Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {space ? "Edit Space" : "Create a new Space"}
      </h2>

      {error && (
        <div className="my-4 p-3 bg-red-900/50 border border-red-500 rounded text-white">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Space Name */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Space name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            required
          />
          <p className="text-gray-500 text-xs mt-1">
            Public URL is: testimonial.to/{spaceName.toLowerCase().replace(/\s+/g, '-') || "your-space"}
          </p>
        </div>

        {/* Header Title */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Header title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Would you like to give a shoutout for xyz?"
            value={headerTitle}
            onChange={(e) => setHeaderTitle(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            required
          />
        </div>

        {/* Custom Message */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Your custom message <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Write a warm message to your customers..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-20"
            required
          />
        </div>

        {/* Questions */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index] = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
              <span className="text-gray-500 text-xs ml-2">
                {question.length}/100
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="ml-2 text-gray-400 hover:text-red-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="h-5 w-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {questions.length < 5 && (
            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 flex items-center text-blue-400 hover:text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5 mr-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m-8-8h16"
                />
              </svg>{" "}
              Add another question
            </button>
          )}
        </div>

        {/* Collection Type */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Collection type
          </label>
          <select
            value={collectionType}
            onChange={(e) => setCollectionType(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white">
            <option>Text only</option>
            {/* <option>Text and Video</option> */}
            {/* <option>Video only</option> */}
          </select>
        </div>

        {/* Collect Star Ratings */}
        <div className="mt-4 flex items-center justify-between">
          <label className="text-sm font-medium">Collect star ratings</label>
          <button
            type="button"
            onClick={() => setStarRatings(!starRatings)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${starRatings ? "bg-green-500" : "bg-gray-600"
              }`}>
            <div
              className={`w-5 h-5 bg-white rounded-full transform ${starRatings ? "translate-x-6" : "translate-x-0"
                }`}
            />
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {space ? "Updating" : "Creating"} Space...
              </>
            ) : (
              space ? "Update Space" : "Create Space"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}