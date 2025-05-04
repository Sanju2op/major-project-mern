import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 text-center">
      {/* Navbar (from LandingPage) */}
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

      {/* 404 content */}
      <main className="mt-32 px-4">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">🤦‍♀️</h1>
        <p className="text-2xl sm:text-3xl font-semibold mb-4">
          Uh oh. That page doesn’t exist.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Head to our <Link to="/" className="text-blue-600 underline">homepage</Link> that does exist,
          or try double-checking the URL.
        </p>
      </main>
    </div>
  );
}
  