// models/Testimonial.js
import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
      index: true,
    },

    author: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      company: {
        type: String,
        trim: true,
      },
      avatar: {
        type: String,
        trim: true,
      },
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    answers: [
      {
        question: { type: String, trim: true },
        answer: { type: String, trim: true },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    source: {
      type: String,
      enum: ["direct", "import", "social"],
      default: "direct",
    },

    socialLinks: {
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;
