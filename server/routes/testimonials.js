import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  submitTestimonial,
  getSpaceTestimonials,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
  getStats,
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

// Get total testimonials and pending approvals
router.get("/stats", requireAuth, getStats);

export default router;
