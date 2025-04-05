// src/components/SyncUser.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const SyncUser = () => {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncUser = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/user", {}, {
          withCredentials: true,
        });
        console.log("✅ User synced successfully!", res.data);
      } catch (err) {
        console.error("❌ Failed to sync user:", err.response?.data || err.message);
      }
    };

    syncUser();
  }, [isSignedIn]);

  return null;
};

export default SyncUser;
