import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import heroImage from "@/assets/hero-trading.jpg";
import { useAuth } from "@/hooks/use-auth";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/welcome");
    }
  }, [isLoading, user, navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {isSignUp ? (
            <SignUp onToggleMode={() => setIsSignUp(false)} />
          ) : (
            <SignIn onToggleMode={() => setIsSignUp(true)} />
          )}
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative">
        <img
          src={heroImage}
          alt="CU Quants Trading Platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-primary/60" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to CU Quants</h1>
            <p className="text-xl mb-6">
              Learn futures trading and earn rewards for attending meetings
            </p>
            <div className="space-y-2 text-lg">
              <p>• Interactive trading platform</p>
              <p>• Real-time market data</p>
              <p>• Educational workshops</p>
              <p>• Reward system for participation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
