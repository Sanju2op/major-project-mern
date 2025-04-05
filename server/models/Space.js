import mongoose from "mongoose";

const SpaceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    headerTitle: { type: String },
    customMessage: { type: String },
    questions: {
      type: [String],
      default: [],
      validate: [(arr) => arr.length <= 5, "Maximum 5 questions allowed"],
    },
    collectionType: {
      type: String,
      enum: ["Text and Video", "Text only", "Video only"],
      required: true,
    },
    starRatings: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Space = mongoose.model("Space", SpaceSchema);
export default Space;
