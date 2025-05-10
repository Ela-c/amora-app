"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from 'lucide-react'; // Import ArrowLeft and Loader2 icon

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Make sure to set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

// New Stripe Checkout Form Component
const StripeCheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentMessage("Stripe is not ready. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    setPaymentMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment_success=true`, 
      },
      redirect: 'if_required' // Recommended: redirect only if necessary (e.g. 3DS)
    });

    // The 'redirect: if_required' option means that if no immediate user action
    // (like 3D Secure) is needed, and the payment is successful or processing,
    // the promise will resolve without an error, but also without a paymentIntent here.
    // The user might or might not be redirected depending on the payment method.
    // If an error occurs before any redirect attempt, or if the payment method 
    // requires no redirect and fails, result.error will be set.

    if (result.error) {
      // Show error to your customer (e.g., payment details incomplete)
      setPaymentMessage(result.error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else {
      // At this point, if there was no error, one of two things happened:
      // 1. The user was redirected to the return_url (e.g., for 3D Secure).
      //    You don't need to do anything here; handle the outcome on your return_url page.
      // 2. The payment was successful without a redirect (e.g. some wallet payments)
      //    or is still processing. `result.paymentIntent` might be available.
      //    For most cases with `redirect: 'if_required'`, you'll rely on webhooks or the return_url.
      
      // For demo purposes, if not redirected and no error, we can assume Stripe is handling it or it succeeded without redirect
      // but it's better to handle final state via webhooks or on the return_url page.
      // If `result.paymentIntent` is available and status is succeeded, you could show a success message here
      // but typically you'd let the return_url handle this.
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setPaymentMessage("Payment successful! Your page should redirect soon or you will see a success message on the redirected page.");
        //setIsProcessing(false); //  Typically unmounts or redirects.
      } else if (result.paymentIntent) {
         setPaymentMessage(`Payment status: ${result.paymentIntent.status}.`);
         //setIsProcessing(false); //  Still might redirect.
      } else {
        // No error, no paymentIntent immediately available, and no redirect happened yet.
        // This means Stripe is processing or will redirect. User should see the processing state.
        // setPaymentMessage("Payment is processing..."); 
        // isProcessing is already true
      }
      // setIsProcessing(false) is tricky here because the component might unmount due to redirect.
      // It's mainly for the error case above where no redirect occurs.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
      >
        {isProcessing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          "Pay Now"
        )}
      </Button>
      {paymentMessage && <div className={`mt-4 text-sm ${paymentMessage.includes("successful") ? "text-green-600" : "text-red-600"}`}>{paymentMessage}</div>}
    </form>
  );
};

export default function PaymentPlansPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string | null>(
    "Flame Plan"
  ); // Default selection

  const [clientSecretForPayment, setClientSecretForPayment] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false); // For loading state of create-payment-intent call

  // Function to parse price string (e.g., "$9.99/month") into cents
  const getPriceInCents = (priceString: string): number | null => {
    const match = priceString.match(/\$([\d.]+)/);
    if (match && match[1]) {
      const price = parseFloat(match[1]);
      return Math.round(price * 100); // Convert to cents and round to avoid floating point issues
    }
    return null;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        const response = await fetch("/api/auth/me");

        if (response.status === 401) {
          console.log("/api/auth/me returned 401, redirecting to login.");
          router.push("/auth/login");
          return;
        }

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          let errorText = "Failed to fetch user data.";
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorText = errorData.error || errorText;
          } else {
            // If not JSON, it might be HTML or plain text
            errorText = await response.text(); 
            console.error("Received non-JSON error response from /api/auth/me:", errorText);
          }
          throw new Error(errorText);
        }

        if (contentType && contentType.includes("application/json")) {
          const userData = await response.json();
          setUser(userData);
        } else {
          const responseText = await response.text();
          console.error("Received non-JSON success response from /api/auth/me:", responseText);
          throw new Error("Unexpected response format from server.");
        }

      } catch (err) {
        console.error("Auth error in fetchUser:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        // Don't redirect here, let the main component render the error state
        // which includes a "Go to Login" button.
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlanName(planName);
    // If payment form is shown, and user changes plan, hide form and reset client secret
    if (showPaymentForm) {
      setShowPaymentForm(false);
      setClientSecretForPayment(null);
    }
  };

  const handleCompleteCheckout = async () => {
    if (selectedPlanName) {
      const plan = paymentPlans.find(p => p.name === selectedPlanName);
      if (!plan) {
        console.error("Selected plan not found");
        setError("Could not find the selected plan. Please try again.");
        return;
      }

      const amountInCents = getPriceInCents(plan.price);
      if (amountInCents === null || amountInCents <= 0) { // Ensure amount is positive
        console.error("Could not parse price for the selected plan or price is invalid");
        setError("There was an issue with the plan pricing. Please contact support.");
        return;
      }

      setCheckoutLoading(true);
      setError(null); // Clear previous errors

      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            amount: amountInCents,
            currency: "usd" 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
          throw new Error("Received an invalid client secret from the server.");
        }
        
        setClientSecretForPayment(clientSecret);
        setShowPaymentForm(true); // Show the payment form

      } catch (checkoutError) {
        console.error("Checkout error:", checkoutError);
        setError(checkoutError instanceof Error ? checkoutError.message : "An unexpected error occurred during checkout.");
        setShowPaymentForm(false); // Ensure form is hidden on error
      } finally {
        setCheckoutLoading(false);
      }

    } else {
      console.log("No plan selected");
      setError("Please select a plan before proceeding to checkout.");
    }
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

  // Stripe Elements options
  const elementsOptions: StripeElementsOptions | undefined = clientSecretForPayment 
    ? { clientSecret: clientSecretForPayment, appearance: { theme: 'stripe' } } 
    : undefined;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {!showPaymentForm && (
          <>
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

            {/* Checkout and Back Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="py-2 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg flex items-center group order-2 sm:order-1"
              >
                <ArrowLeft className="h-5 w-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Main Menu
              </Button>
              <Button
                onClick={handleCompleteCheckout}
                disabled={!selectedPlanName || checkoutLoading}
                className="w-full sm:w-auto py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 order-1 sm:order-2 flex items-center justify-center"
              >
                {checkoutLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                ) : (
                  "Complete Checkout"
                )}
              </Button>
            </div>
            {error && <p className="mt-4 text-center text-red-500">Error: {error}</p>}
          </>
        )}

        {showPaymentForm && clientSecretForPayment && elementsOptions && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Secure Payment for {selectedPlanName}
            </h2>
            <Elements stripe={stripePromise} options={elementsOptions}>
              <StripeCheckoutForm clientSecret={clientSecretForPayment} />
            </Elements>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPaymentForm(false);
                setClientSecretForPayment(null);
                setError(null); // Clear any checkout specific errors
              }} 
              className="mt-8 w-full sm:w-auto py-2 px-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              Cancel Payment / Change Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 