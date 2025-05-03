import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Pencil } from "lucide-react";
export default function SpacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    avatar: "",
    content: "",
    rating: 5,
    answers: [],
    twitter: "",
    linkedin: "",
    facebook: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/spaces/public/${slug}`);
        const spaceData = res.data.space;
        if (!spaceData) {
          navigate("/not-found");
          return;
        }
        setSpace(spaceData);
        const initialAnswers = (spaceData.questions || []).map((q) => ({
          question: q,
          answer: "",
        }));
        setForm((prev) => ({ ...prev, answers: initialAnswers }));
      } catch (err) {
        console.error("Error loading space:", err);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchSpace();
  }, [slug, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnswerChange = (index, value) => {
    const updated = [...form.answers];
    updated[index].answer = value;
    setForm((prev) => ({ ...prev, answers: updated }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/testimonials/${space.slug}`, form);
      setSuccess(true);
      setShowForm(false); // Optional: hide form after submission
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
    }
  };


  if (loading) return <div className="p-16 text-white">Loading...</div>;
  if (!space) return <div className="p-16 text-red-400">Space not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      {/* Logo */}
      <div className="flex justify-start mb-10">
        <img
          src="https://testimonial.to/static/media/logo.5ff3c18e.svg"
          alt="Logo"
          className="h-10"
        />
      </div>

      {/* Space Info */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{space.headerTitle}</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          {space.customMessage}
        </p>
      </div>

      {/* Questions */}
      {space.questions.length > 0 && (
        <div className="max-w-xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-3 text-center">Questions</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            {space.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Button */}
      {!showForm && !success && (
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition"
            onClick={() => setShowForm(true)}
          >
            <Pencil size={18} />
            Send in text
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="text-center text-green-400 text-xl mt-10">
          🎉 Thanks for your testimonial!
        </div>
      )}

      {/* Testimonial Form */}
      {showForm && !success && (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto mt-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Email (optional)"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Company (optional)"
              name="company"
              value={form.company}
              onChange={handleChange}
            />
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Avatar URL (optional)"
              name="avatar"
              value={form.avatar}
              onChange={handleChange}
            />
          </div>

          {space.starRatings && (
            <div>
              <label className="block mb-1 font-medium">Rating (1-5)</label>
              <input
                className="w-full p-2 bg-gray-700 rounded-md"
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                min={1}
                max={5}
                required
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Testimonial</label>
            <textarea
              className="w-full h-28 p-3 bg-gray-700 rounded-md"
              placeholder="Share your experience..."
              name="content"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          {form.answers.map((qa, i) => (
            <div key={i}>
              <label className="block mb-1 font-medium">
                {qa.question}
              </label>
              <input
                className="w-full p-3 bg-gray-700 rounded-md"
                type="text"
                value={qa.answer}
                onChange={(e) => handleAnswerChange(i, e.target.value)}
              />
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Twitter"
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
            />
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="LinkedIn"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
            />
            <input
              className="p-3 bg-gray-700 rounded-md"
              placeholder="Facebook"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md font-semibold"
          >
            Submit Testimonial
          </button>
        </form>
      )}
    </div>
  );
}
