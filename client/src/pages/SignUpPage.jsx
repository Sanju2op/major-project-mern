import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp path="/signup" routing="path" signInUrl="/signin" />
    </div>
  );
}
