"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Plan {
  name: string;
  price: string;
  features: string[];
  cta: string;
}

const paymentPlans: Plan[] = [
  {
    name: "Free Spirit",
    price: "$0/month",
    features: [
      "Create your profile",
      "Browse profiles",
      "Send 5 introduction messages per day",
      "Basic search filters",
    ],
    cta: "Get Started",
  },
  {
    name: "Spark Plan",
    price: "$9.99/month",
    features: [
      "See who likes you",
      "Limited daily swipes",
      "Basic search filters",
    ],
    cta: "Choose Spark",
  },
  {
    name: "Flame Plan",
    price: "$19.99/month",
    features: [
      "All Spark features",
      "Unlimited daily swipes",
      "Advanced search filters",
      "1 Profile Boost per week",
      "Read receipts",
    ],
    cta: "Choose Flame",
  },
  {
    name: "Inferno Plan",
    price: "$29.99/month",
    features: [
      "All Flame features",
      "See who viewed your profile",
      "Incognito mode",
      "Priority customer support",
      "Message before matching (limited)",
    ],
    cta: "Choose Inferno",
  },
];

export default function PaymentPlansPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>("Flame Plan"); // Default selection

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/me");
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Auth error:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        // Potentially redirect to login or show error message
        // For now, if any error occurs and user is not set, it will redirect via the main conditional rendering.
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlanName(planName);
    // Here you might add logic to proceed to a checkout page or save the preference
    // For now, it just updates the selection state
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}. Please try logging in again.</p>
        {/* Optionally, add a button to redirect to login */}
         <Button onClick={() => router.push("/auth/login")} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect in fetchUser or the error state.
    // If not loading and no user, implies an issue or unauthorized.
    // router.push("/auth/login"); // Redundant if fetchUser handles it, but as a fallback.
    return (
       <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Our Plans, {user.firstName}!
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Find the perfect plan to connect and spark something new.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg p-8 flex flex-col ${selectedPlanName === plan.name ? 'border-2 border-blue-600 ring-4 ring-blue-600 ring-opacity-30' : 'border border-gray-200 hover:shadow-xl transition-shadow duration-300'}`}
            >
              <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
              <p className="text-xl font-bold my-4 text-gray-900">{plan.price}</p>
              <ul className="space-y-2 text-gray-600 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-6 w-6 text-green-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors duration-200 ${selectedPlanName === plan.name ? 'bg-green-500 hover:bg-green-600 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={() => handleSelectPlan(plan.name)}
                disabled={selectedPlanName === plan.name}
              >
                {selectedPlanName === plan.name ? "Current Plan" : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-start">
          <Button 
            variant="ghost"
            onClick={() => router.push('/dashboard')} 
            className="py-2 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Main Menu
          </Button>
        </div>

      </div>
    </div>
  );
} 