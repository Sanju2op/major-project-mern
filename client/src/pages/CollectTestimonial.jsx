import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CollectTestimonial() {
  const { spaceName } = useParams(); // space slug
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Fetch space data (including questions)
  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/spaces/${spaceName}`);
        const spaceData = res.data.space;
        setSpace(spaceData);

        // Initialize answers array based on questions
        const initialAnswers = (spaceData.questions || []).map((q) => ({
          question: q,
          answer: "",
        }));
        setForm((prev) => ({ ...prev, answers: initialAnswers }));
      } catch (err) {
        console.error("Failed to fetch space:", err);
      } finally {
        setLoading(false);
      }
    };

    if (spaceName) fetchSpace();
  }, [spaceName]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...form.answers];
    updatedAnswers[index].answer = value;
    setForm((prev) => ({ ...prev, answers: updatedAnswers }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/testimonials/${space._id}`, {
        ...form,
      });
      setSuccess(true);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit testimonial.");
    }
  };

  if (loading) return <div className="p-16 text-white">Loading...</div>;
  if (!space) return <div className="p-16 text-red-400">Space not found</div>;
  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center text-xl">
        🎉 Thank you for your testimonial!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {space.headerTitle}
        </h1>
        <p className="text-gray-400 text-center mb-10">{space.customMessage}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block mb-1 font-medium">Rating (1–5)</label>
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
      </div>
    </div>
  );
}
