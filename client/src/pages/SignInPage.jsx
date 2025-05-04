import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-black">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
}
