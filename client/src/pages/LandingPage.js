import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero-image.png"; // make sure the image exists here

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h1 className="text-4xl text-blue-500 font-bold">Testimonials</h1>
        <div className="space-x-4">
          <SignedOut>
            <Link to="/signin">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
                Create Account
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left Side - Image */}
          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Feedback illustration"
              className="rounded-lg shadow-md w-[500px] h-[400px] object-cover"
            />
          </div>

          {/* Right Side - Text */}
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-5xl text-white font-bold leading-tight">
              Get meaningful feedback on your Product
            </h2>
            <p className="text-gray-400 text-lg">
              Join with <span className="font-semibold">4,600+ Companies</span>{" "}
              and start getting feedback right now.
            </p>
            <Link to="/signin">
              <button className="w-full md:w-auto px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
