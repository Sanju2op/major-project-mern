import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const SyncUser = () => {
  const { isSignedIn, user } = useUser(); // 👈 get user info

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          userId: user.id, // 👈 send the Clerk userId
        });

        console.log("✅", res.data.message);
      } catch (err) {
        console.error("❌ Failed to sync user:", err.response?.data || err.message);
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  return null;
};

export default SyncUser;
