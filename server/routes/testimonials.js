import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
// import {
//   submitTestimonial,
//   getSpaceTestimonials, // 👈 Import the new controller
// } from "../controllers/testimonialController.js";
import {
  submitTestimonial,
  getSpaceTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();
const requireAuth = ClerkExpressRequireAuth({});

// Public: Submit testimonial
router.post("/:spaceSlug", submitTestimonial);

// 🔐 Private: Get testimonials for a space
router.get("/space/:slug", requireAuth, getSpaceTestimonials);

// Approve testimonial
router.patch("/:testimonialId/approve", requireAuth, approveTestimonial);

// Reject testimonial
router.patch("/:testimonialId/reject", requireAuth, rejectTestimonial);

// Delete testimonial
router.delete("/:testimonialId", requireAuth, deleteTestimonial);

export default router;
