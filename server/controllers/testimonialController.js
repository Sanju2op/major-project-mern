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

// Fetch testimonials for a specific space (PRIVATE)
export const getSpaceTestimonials = async (req, res) => {
  const { spaceId } = req.params;
  const { userId } = req.auth;

  try {
    const space = await Space.findOne({ _id: spaceId, userId });

    if (!space) {
      return res
        .status(404)
        .json({ message: "Space not found or access denied" });
    }

    const testimonials = await Testimonial.find({ spaceId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
