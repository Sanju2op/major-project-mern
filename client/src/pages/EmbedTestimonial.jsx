import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EmbedTestimonial = () => {
  const { id } = useParams();
  const [testimonialData, setTestimonialData] = useState(null);
  const api = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(
          `${api}/api/embed/testimonial/${id}`
        );
        setTestimonialData(res.data.testimonial);
      } catch (err) {
        console.error("Error loading embed:", err);
        setTestimonialData({ error: "Failed to load testimonial" });
      }
    };

    fetchTestimonial();
  }, [id]);

  if (!testimonialData) return <p>Loading...</p>;
  if (testimonialData.error) return <p>{testimonialData.error}</p>;

  const t = testimonialData;

  return (
    <div className="font-sans p-6 bg-gray-50 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={t.author.avatar}
            alt={`${t.author.name}'s avatar`}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h4 className="text-lg font-semibold">{t.author.name}</h4>
            <p className="text-sm text-gray-500">{t.author.company}</p>
          </div>
        </div>

        <p className="text-gray-800 mb-4">{t.content}</p>

        {t.rating && (
          <div className="text-yellow-500 mb-4">
            {"★".repeat(t.rating)}
            {"☆".repeat(5 - t.rating)}
          </div>
        )}

        {t.answers && t.answers.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h5 className="text-sm text-gray-700 font-semibold">Answers:</h5>
            {t.answers.map((answer) => (
              <div key={answer._id} className="mt-2">
                <p className="font-semibold">{answer.question}</p>
                <p className="text-gray-600">{answer.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbedTestimonial;
