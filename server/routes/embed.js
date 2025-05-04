import express from "express";
import Space from "../models/Space.js";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

// GET /api/embed/space/:slug - Get approved testimonials for a space
router.get("/space/:slug", async (req, res) => {
  try {
    const space = await Space.findOne({ slug: req.params.slug });

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const testimonials = await Testimonial.find({
      spaceId: space._id,
      status: "approved",
    }).sort({ createdAt: -1 });

    res.json({ space, testimonials });
  } catch (err) {
    console.error("Error fetching embedded space:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/embed/testimonial/:id - Get a single testimonial
router.get("/testimonial/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      status: "approved",
    });

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ testimonial });
  } catch (err) {
    console.error("Error fetching embedded testimonial:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
