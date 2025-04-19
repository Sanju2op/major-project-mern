import express from "express";
import { submitTestimonial } from "../controllers/testimonialController.js";

const router = express.Router();

// POST /api/testimonials/:spaceSlug
router.post("/:spaceSlug", submitTestimonial);

export default router;
