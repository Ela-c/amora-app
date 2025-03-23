"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock activity data
const mockActivities = [
	{
		id: "1",
		title: "Dinner at La Brasserie",
		description:
			"Enjoy a fine dining experience with a group of friendly people.",
		type: "Dinner",
		location: "New York",
		date: "2024-04-20T19:00:00",
		price: 45.0,
		spots: 8,
		spotsLeft: 3,
		image: "https://source.unsplash.com/random/?restaurant",
	},
	{
		id: "2",
		title: "Hiking at Bear Mountain",
		description:
			"A moderate 5-mile hike with beautiful views and great company.",
		type: "Hiking",
		location: "Upstate New York",
		date: "2024-04-22T09:00:00",
		price: 25.0,
		spots: 12,
		spotsLeft: 5,
		image: "https://source.unsplash.com/random/?hiking",
	},
	{
		id: "3",
		title: "Wine Tasting Tour",
		description:
			"Visit three local wineries and taste premium wines with a group of wine enthusiasts.",
		type: "Wine Tasting",
		location: "Napa Valley",
		date: "2024-04-25T14:00:00",
		price: 65.0,
		spots: 10,
		spotsLeft: 4,
		image: "https://source.unsplash.com/random/?wine",
	},
	{
		id: "4",
		title: "Museum Art Tour",
		description:
			"Explore modern art with an experienced guide and meet new people.",
		type: "Museum",
		location: "Chicago",
		date: "2024-04-28T11:00:00",
		price: 30.0,
		spots: 15,
		spotsLeft: 8,
		image: "https://source.unsplash.com/random/?museum",
	},
	{
		id: "5",
		title: "Coffee & Conversation",
		description: "Meet up for coffee, pastries, and great conversation.",
		type: "Coffee",
		location: "Seattle",
		date: "2024-04-18T10:00:00",
		price: 20.0,
		spots: 6,
		spotsLeft: 2,
		image: "https://source.unsplash.com/random/?cafe",
	},
	{
		id: "6",
		title: "Beach Volleyball",
		description:
			"Join a friendly beach volleyball game and make new friends.",
		type: "Sports Game",
		location: "Miami",
		date: "2024-04-24T16:00:00",
		price: 15.0,
		spots: 12,
		spotsLeft: 6,
		image: "https://source.unsplash.com/random/?beach+volleyball",
	},
];

// Activity locations
const locations = [
	"All Locations",
	"New York",
	"Upstate New York",
	"Napa Valley",
	"Chicago",
	"Seattle",
	"Miami",
];

// Activity types
const activityTypes = [
	"All Types",
	"Dinner",
	"Hiking",
	"Wine Tasting",
	"Museum",
	"Coffee",
	"Sports Game",
];

export default function ActivitiesPage() {
	const router = useRouter();
	const [selectedLocation, setSelectedLocation] = useState("All Locations");
	const [selectedType, setSelectedType] = useState("All Types");
	const [searchQuery, setSearchQuery] = useState("");

	// Filter activities based on selected criteria
	const filteredActivities = mockActivities.filter((activity) => {
		const matchesLocation =
			selectedLocation === "All Locations" ||
			activity.location === selectedLocation;
		const matchesType =
			selectedType === "All Types" || activity.type === selectedType;
		const matchesSearch =
			activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			activity.description
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

		return matchesLocation && matchesType && matchesSearch;
	});

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

	const handleViewActivity = (activityId: string) => {
		router.push(`/activities/${activityId}`);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Discover Activities
			</h1>

			<div className="flex flex-col md:flex-row gap-4 mb-8">
				<div className="flex-1">
					<Input
						placeholder="Search activities..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full"
					/>
				</div>
				<div className="w-full md:w-48">
					<Select
						value={selectedLocation}
						onValueChange={setSelectedLocation}
					>
						<SelectTrigger>
							<SelectValue placeholder="Location" />
						</SelectTrigger>
						<SelectContent>
							{locations.map((location) => (
								<SelectItem key={location} value={location}>
									{location}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="w-full md:w-48">
					<Select
						value={selectedType}
						onValueChange={setSelectedType}
					>
						<SelectTrigger>
							<SelectValue placeholder="Activity Type" />
						</SelectTrigger>
						<SelectContent>
							{activityTypes.map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredActivities.length > 0 ? (
					filteredActivities.map((activity) => (
						<Card key={activity.id} className="overflow-hidden">
							<div className="aspect-video w-full relative overflow-hidden">
								<img
									src={activity.image}
									alt={activity.title}
									className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
								/>
								<div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
									${activity.price}
								</div>
							</div>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{activity.title}</CardTitle>
										<CardDescription className="text-sm text-gray-500">
											{activity.type} •{" "}
											{activity.location}
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm mb-4">
									{activity.description}
								</p>
								<div className="text-sm text-gray-500 mb-2">
									<span className="font-medium">
										Date & Time:
									</span>{" "}
									{formatDate(activity.date)}
								</div>
								<div className="text-sm text-gray-500">
									<span className="font-medium">
										Spots left:
									</span>{" "}
									{activity.spotsLeft} of {activity.spots}
								</div>
							</CardContent>
							<CardFooter>
								<Button
									className="w-full"
									onClick={() =>
										handleViewActivity(activity.id)
									}
								>
									View Details
								</Button>
							</CardFooter>
						</Card>
					))
				) : (
					<div className="col-span-3 text-center py-12">
						<p className="text-xl font-medium text-gray-500">
							No activities match your criteria.
						</p>
						<p className="mt-2 text-gray-400">
							Try adjusting your filters or search query.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
