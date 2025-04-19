import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  submitTestimonial,
  getSpaceTestimonials, // 👈 Import the new controller
} from "../controllers/testimonialController.js";

const router = express.Router();
const requireAuth = ClerkExpressRequireAuth({});

// Public: Submit testimonial
router.post("/:spaceSlug", submitTestimonial);

// 🔐 Private: Get testimonials for a space
router.get("/space/:spaceId", requireAuth, getSpaceTestimonials);

export default router;
