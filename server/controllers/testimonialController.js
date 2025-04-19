import Testimonial from "../models/Testimonial.js";
import Space from "../models/Space.js";

export const submitTestimonial = async (req, res) => {
  const { spaceSlug } = req.params;
  const {
    name,
    email,
    company,
    avatar,
    content,
    rating,
    answers,
    twitter,
    linkedin,
    facebook,
  } = req.body;

  try {
    const space = await Space.findOne({ slug: spaceSlug });

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const testimonial = new Testimonial({
      spaceId: space._id,
      author: { name, email, company, avatar },
      content,
      rating,
      answers,
      socialLinks: { twitter, linkedin, facebook },
      status: "pending",
      source: "direct",
    });

    await testimonial.save();

    return res
      .status(201)
      .json({ message: "Testimonial submitted!", testimonial });
  } catch (err) {
    console.error("Testimonial submission error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
