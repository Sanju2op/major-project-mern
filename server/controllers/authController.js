import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing Clerk user ID" });
    }

    let existingUser = await User.findOne({ userId });

    if (!existingUser) {
      existingUser = await User.create({ userId });
      console.log("✅ New user created:", existingUser.userId);
    } else {
      console.log("✅ User already exists:", existingUser.userId);
    }

    return res
      .status(200)
      .json({ message: "User synced successfully", user: existingUser });
  } catch (err) {
    console.error("❌ Error syncing user:", err.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
