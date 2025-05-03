const express = require("express");
const router = express.Router();
const Space = require("../models/Space");
const Testimonial = require("../models/Testimonial");

// Get embed iframe for a space
router.get("/:spaceId", async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId);
    if (!space) {
      return res.status(404).send("Space not found");
    }

    // Get approved testimonials for the space
    const testimonials = await Testimonial.find({
      space: req.params.spaceId,
      status: "approved",
    }).populate("author");

    // Generate the embed iframe
    const iframe = `
      <iframe src="${req.protocol}://${req.get("host")}/api/embed/${
      space._id
    }/iframe" width="600" height="400" frameborder="0" allowfullscreen></iframe>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(iframe);
  } catch (error) {
    console.error("Error generating embed iframe:", error);
    res.status(500).send("Error generating embed iframe");
  }
});

// Get embed iframe for a single testimonial
router.get("/testimonial/:testimonialId", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.testimonialId
    ).populate("author");
    if (!testimonial || testimonial.status !== "approved") {
      return res.status(404).send("Testimonial not found or not approved");
    }

    // Generate the embed iframe for a single testimonial
    const iframe = `
      <iframe src="${req.protocol}://${req.get("host")}/api/embed/testimonial/${
      testimonial._id
    }/iframe" width="600" height="400" frameborder="0" allowfullscreen></iframe>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(iframe);
  } catch (error) {
    console.error("Error generating embed iframe for testimonial:", error);
    res.status(500).send("Error generating embed iframe for testimonial");
  }
});

module.exports = router;
