import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const EmbedTestimonial = () => {
  const { id } = useParams();
  const [testimonial, setTestimonial] = useState(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/embed/testimonial/${id}`
        );
        setTestimonial(res.data);
      } catch (err) {
        console.error("Error loading embed:", err);
        setTestimonial({ error: "Failed to load testimonial" });
      }
    };

    fetchTestimonial();
  }, [id]);

  if (!testimonial) return <p>Loading...</p>;
  if (testimonial.error) return <p>{testimonial.error}</p>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <strong>{testimonial.author.name}</strong>
      <p>{testimonial.content}</p>
      {testimonial.rating && <p>⭐ {testimonial.rating}/5</p>}
    </div>
  );
};

export default EmbedTestimonial;
