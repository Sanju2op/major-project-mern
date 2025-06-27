import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import testimonialRoutes from "./routes/testimonials.js";
import embedRoutes from "./routes/embed.js";

dotenv.config();
const app = express();

// Middleware
// app.use(cors({ origin: allowedOrigins, credentials: true }));
// app.use(cors({ origin: "https://major-project-mern.vercel.app", credentials: true }));
const allowedOrigins = [
  "http://localhost:3000",
  "https://major-project-mern.vercel.app",
  "https://major-project-mern-git-main-sanjay-lagariyas-projects.vercel.app",
  "https://major-project-mern-lwp5z9eaf-sanjay-lagariyas-projects.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/testimonials", testimonialRoutes); // ✅ add this line
app.use("/api/embed", embedRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
