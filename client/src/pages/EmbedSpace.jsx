import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EmbedSpace = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/embed/space/${slug}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Error loading embed:", err);
        setData({ error: "Failed to load space data" });
      }
    };

    fetchSpaceData();
  }, [slug]);

  if (!data) return <p>Loading...</p>;
  if (data.error) return <p>{data.error}</p>;

  return (
    <div className="font-sans p-6 bg-gray-50">
      <h3 className="text-2xl font-bold text-center mb-6">{data.space.headerTitle}</h3>
      
      {data.testimonials.length === 0 ? (
        <p className="text-center text-gray-500">No testimonials yet.</p>
      ) : (
        data.testimonials.map((t) => (
          <div
            key={t._id}
            className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-lg mx-auto"
          >
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

            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </span>
            </div>
            {t.answers && t.answers.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h5 className="text-sm text-gray-700">Answers:</h5>
                {t.answers.map((answer, index) => (
                  <div key={answer._id} className="mt-2">
                    <p className="font-semibold">{answer.question}</p>
                    <p className="text-gray-600">{answer.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default EmbedSpace;
