import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import Space from "../models/Space.js";

const router = express.Router();

// Middleware to require authentication
const requireAuth = ClerkExpressRequireAuth({});

// Create a new space
router.post("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  try {
    const {
      name,
      headerTitle,
      customMessage,
      questions,
      collectionType,
      starRatings,
    } = req.body;

    // Generate a slug from the space name
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // Check if slug already exists
    const existingSpace = await Space.findOne({ slug });
    if (existingSpace) {
      return res
        .status(400)
        .json({ message: "A space with this name already exists" });
    }

    const newSpace = new Space({
      userId,
      name,
      slug,
      headerTitle,
      customMessage,
      questions,
      collectionType,
      starRatings,
    });

    await newSpace.save();

    res.status(201).json({
      success: true,
      space: newSpace,
    });
  } catch (error) {
    console.error("Error creating space:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all spaces for a user
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.auth;
  if (!userId) {
    // console.error("userid not found", userId);
  } else {
    // console.error("userId found", userId, process.env.CLERK_SECRET_KEY);
  }

  try {
    const spaces = await Space.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      spaces,
    });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// // Get a specific space
// router.get("/:spaceName", requireAuth, async (req, res) => {
//   const { userId } = req.auth;

//   try {
//     const space = await Space.findOne({ name: req.params.spaceName, userId });

//     if (!space) {
//       return res.status(404).json({ message: "Space not found" });
//     }

//     res.json({
//       success: true,
//       space,
//     });
//   } catch (error) {
//     console.error("Error fetching space:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// ✅ PUBLIC - Get a specific space by name (for viewing and submitting testimonials)
router.get("/:spaceName", async (req, res) => {
  try {
    const space = await Space.findOne({ name: req.params.spaceName });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.json({
      success: true,
      space,
    });
  } catch (error) {
    console.error("Error fetching space:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a space
router.put("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  try {
    const {
      name,
      headerTitle,
      customMessage,
      questions,
      collectionType,
      starRatings,
    } = req.body;

    // Find the space first
    const space = await Space.findOne({ _id: req.params.id, userId });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // If name changed, update slug (and check for conflicts)
    if (name !== space.name) {
      const newSlug = name.toLowerCase().replace(/\s+/g, "-");
      const existingSpace = await Space.findOne({
        slug: newSlug,
        _id: { $ne: space._id },
      });

      if (existingSpace) {
        return res
          .status(400)
          .json({ message: "A space with this name already exists" });
      }

      space.slug = newSlug;
    }

    // Update space fields
    space.name = name;
    space.headerTitle = headerTitle;
    space.customMessage = customMessage;
    space.questions = questions;
    space.collectionType = collectionType;
    space.starRatings = starRatings;

    await space.save();

    res.json({
      success: true,
      space,
    });
  } catch (error) {
    console.error("Error updating space:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a space
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = req.auth;

  try {
    const space = await Space.findOneAndDelete({ _id: req.params.id, userId });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.json({
      success: true,
      message: "Space deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting space:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
