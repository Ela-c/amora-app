"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock activity data
const mockActivities = [
	{
		id: "1",
		title: "Dinner at La Brasserie",
		description:
			"Enjoy a fine dining experience with a group of friendly people.",
		longDescription:
			"Join us for an unforgettable dining experience at La Brasserie, one of the city's most celebrated restaurants. This is not just about the food - it's about connecting with new people in an elegant setting. Our private dining area provides the perfect atmosphere for meaningful conversations and new connections. The evening includes a three-course meal with optional wine pairings. Whether you're new to the city or just looking to expand your social circle, this dinner is designed to bring people together through a shared love of good food and conversation.",
		type: "Dinner",
		location: "New York",
		address: "123 5th Avenue, New York, NY 10001",
		date: "2024-04-20T19:00:00",
		price: 45.0,
		spots: 8,
		spotsLeft: 3,
		image: "https://source.unsplash.com/random/?restaurant",
		host: "Sarah Johnson",
		hostBio:
			"Food enthusiast and social connector. Sarah has been organizing dinner events for over 5 years.",
		includedItems: [
			"Three-course meal",
			"Welcome cocktail",
			"Professional host",
		],
	},
	{
		id: "2",
		title: "Hiking at Bear Mountain",
		description:
			"A moderate 5-mile hike with beautiful views and great company.",
		longDescription:
			"Experience the beauty of nature while making new connections on this guided hike through Bear Mountain. This moderate 5-mile trail offers stunning views, fresh air, and the chance to meet fellow outdoor enthusiasts. Our experienced guide will lead the way, sharing interesting facts about local flora and fauna. The hike is designed for all fitness levels, with plenty of breaks to chat and take photos. After the hike, we'll gather for refreshments and continue the conversation. It's a perfect opportunity to expand your social circle while enjoying the great outdoors.",
		type: "Hiking",
		location: "Upstate New York",
		address:
			"Bear Mountain State Park, Perkins Memorial Drive, Bear Mountain, NY 10911",
		date: "2024-04-22T09:00:00",
		price: 25.0,
		spots: 12,
		spotsLeft: 5,
		image: "https://source.unsplash.com/random/?hiking",
		host: "Michael Torres",
		hostBio:
			"Certified hiking guide and nature photographer with a passion for connecting people through outdoor activities.",
		includedItems: [
			"Guided tour",
			"Snacks and water",
			"Park entrance fees",
		],
	},
	// Other activities...
];

export default function ActivityDetailPageClient({ id }: { id: string }) {
	const router = useRouter();
	const [showPaymentDialog, setShowPaymentDialog] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	// Find activity by ID
	const activity = mockActivities.find((a) => a.id === id);

	// If activity not found, show error or redirect
	if (!activity) {
		return (
			<div className="container mx-auto px-4 py-12 text-center">
				<h1 className="text-3xl font-bold mb-4">Activity Not Found</h1>
				<p className="mb-8">
					Sorry, the activity you&apos;re looking for doesn&apos;t
					exist or has been removed.
				</p>
				<Button onClick={() => router.push("/activities")}>
					Browse Other Activities
				</Button>
			</div>
		);
	}

	// Format date to readable format
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		});
	};

	const handleJoinActivity = () => {
		setShowPaymentDialog(true);
	};

	const handlePayment = (e: React.FormEvent) => {
		e.preventDefault();
		setIsProcessing(true);

		// Simulate payment processing
		setTimeout(() => {
			setIsProcessing(false);
			setShowPaymentDialog(false);
			toast.success("Payment successful! You've joined the activity.");
			router.push("/dashboard");
		}, 2000);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<Button
				variant="ghost"
				onClick={() => router.push("/activities")}
				className="mb-6"
			>
				← Back to Activities
			</Button>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="relative aspect-video rounded-xl overflow-hidden mb-6">
						<img
							src={activity.image}
							alt={activity.title}
							className="object-cover w-full h-full"
						/>
					</div>

					<h1 className="text-3xl font-bold mb-2">
						{activity.title}
					</h1>
					<div className="flex items-center gap-2 mb-6">
						<span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
							{activity.type}
						</span>
						<span className="text-gray-500">•</span>
						<span className="text-gray-600">
							{activity.location}
						</span>
					</div>

					<div className="prose max-w-none mb-8">
						<h2 className="text-xl font-semibold mb-2">
							About This Activity
						</h2>
						<p className="mb-4">{activity.longDescription}</p>

						<h2 className="text-xl font-semibold mb-2">
							When and Where
						</h2>
						<p className="mb-2">
							<span className="font-medium">Date & Time:</span>{" "}
							{formatDate(activity.date)}
						</p>
						<p className="mb-4">
							<span className="font-medium">Location:</span>{" "}
							{activity.address}
						</p>

						<h2 className="text-xl font-semibold mb-2">
							What&apos;s Included
						</h2>
						<ul className="list-disc pl-5 mb-4">
							{activity.includedItems.map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>

						<h2 className="text-xl font-semibold mb-2">
							Your Host
						</h2>
						<p className="font-medium">{activity.host}</p>
						<p className="mb-4">{activity.hostBio}</p>
					</div>
				</div>

				<div className="lg:col-span-1">
					<Card className="sticky top-6">
						<CardContent className="p-6">
							<div className="mb-6">
								<p className="text-3xl font-bold mb-2">
									${activity.price}
								</p>
								<p className="text-sm text-gray-500">
									Per person • {activity.spotsLeft} of{" "}
									{activity.spots} spots left
								</p>
							</div>

							<div className="mb-6">
								<p className="font-medium mb-1">Date & Time</p>
								<p className="text-gray-600">
									{formatDate(activity.date)}
								</p>
							</div>

							<div className="mb-6">
								<p className="font-medium mb-1">Location</p>
								<p className="text-gray-600">
									{activity.address}
								</p>
							</div>

							<Button
								className="w-full"
								size="lg"
								onClick={handleJoinActivity}
								disabled={activity.spotsLeft === 0}
							>
								{activity.spotsLeft === 0
									? "Sold Out"
									: "Join This Activity"}
							</Button>

							<p className="text-xs text-center text-gray-400 mt-4">
								You won&apos;t be charged until you complete the
								payment process
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Payment Dialog */}
			<Dialog
				open={showPaymentDialog}
				onOpenChange={setShowPaymentDialog}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Complete Your Payment</DialogTitle>
						<DialogDescription>
							You&apos;re joining {activity.title} for $
							{activity.price}
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handlePayment} className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="cardholder">Cardholder Name</Label>
							<Input
								id="cardholder"
								placeholder="John Doe"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="cardnumber">Card Number</Label>
							<Input
								id="cardnumber"
								placeholder="4242 4242 4242 4242"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="expiry">Expiry Date</Label>
								<Input
									id="expiry"
									placeholder="MM/YY"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="cvc">CVC</Label>
								<Input id="cvc" placeholder="123" required />
							</div>
						</div>

						<DialogFooter className="pt-4">
							<Button
								type="submit"
								className="w-full"
								disabled={isProcessing}
							>
								{isProcessing
									? "Processing..."
									: `Pay $${activity.price}`}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
