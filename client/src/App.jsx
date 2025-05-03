// src/App.js
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SyncUser from "./components/SyncUser";
import ProductPage from "./pages/ProductPage";
import SpacePage from "./pages/SpacePage";
import NotFound from "./pages/NotFound";
import EmbedPage from "./pages/EmbedPage";

const clerkFrontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Router>
        <SyncUser />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup/*" element={<SignUpPage />} />
          <Route path="/products/:spaceName" element={<ProductPage />} />
          <Route path="/:slug" element={<SpacePage />} />
          <Route path="/embed/:spaceId/iframe" element={<EmbedPage />} />
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
