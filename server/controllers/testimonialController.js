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
  const { slug } = req.params;
  const { userId } = req.auth;

  try {
    const space = await Space.findOne({ slug, userId });

    if (!space) {
      return res
        .status(404)
        .json({ message: "Space not found - testimonialController.js" });
    }

    const testimonials = await Testimonial.find({ spaceId: space._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "space found - testimonialController.js",
      count: testimonials.length,
      testimonials,
    });
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve a testimonial
export const approveTestimonial = async (req, res) => {
  const { testimonialId } = req.params;
  const { userId } = req.auth;

  try {
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    const space = await Space.findOne({ _id: testimonial.spaceId, userId });
    if (!space) return res.status(403).json({ message: "Access denied" });

    testimonial.status = "approved";
    await testimonial.save();

    res.status(200).json({ message: "Testimonial approved", testimonial });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject a testimonial
export const rejectTestimonial = async (req, res) => {
  const { testimonialId } = req.params;
  const { userId } = req.auth;

  try {
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    const space = await Space.findOne({ _id: testimonial.spaceId, userId });
    if (!space) return res.status(403).json({ message: "Access denied" });

    testimonial.status = "rejected";
    await testimonial.save();

    res.status(200).json({ message: "Testimonial rejected", testimonial });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a testimonial
export const deleteTestimonial = async (req, res) => {
  const { testimonialId } = req.params;
  const { userId } = req.auth;

  try {
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const space = await Space.findOne({ _id: testimonial.spaceId, userId });
    if (!space) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Testimonial.findByIdAndDelete(testimonialId);

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
