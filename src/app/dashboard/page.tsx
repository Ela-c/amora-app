"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data for upcoming activities
const upcomingActivities = [
	{
		id: "1",
		title: "Dinner at La Brasserie",
		description:
			"Enjoy a fine dining experience with a group of friendly people.",
		type: "Dinner",
		location: "New York",
		date: "2024-04-20T19:00:00",
		price: 45.0,
		image: "https://source.unsplash.com/random/?restaurant",
		status: "confirmed", // confirmed, completed, cancelled
		participants: 8,
		address: "123 5th Avenue, New York, NY 10001",
	},
];

// Mock data for past activities
const pastActivities = [
	{
		id: "3",
		title: "Cooking Class: Italian Cuisine",
		description: "Learn to make authentic Italian dishes with new friends.",
		type: "Cooking Class",
		location: "Boston",
		date: "2024-03-15T18:00:00",
		price: 55.0,
		image: "https://source.unsplash.com/random/?cooking",
		status: "completed",
		participants: [
			{
				id: "u1",
				name: "Jessica Liu",
				image: "https://source.unsplash.com/random/?woman,face",
				liked: false,
			},
			{
				id: "u2",
				name: "Robert Kim",
				image: "https://source.unsplash.com/random/?man,face",
				liked: false,
			},
			{
				id: "u3",
				name: "Lisa Patel",
				image: "https://source.unsplash.com/random/?woman,portrait",
				liked: false,
			},
			{
				id: "u4",
				name: "James Wilson",
				image: "https://source.unsplash.com/random/?man,portrait",
				liked: false,
			},
		],
	},
];

// Mock data for matches
const matches = [
	{
		id: "m1",
		name: "Emily Johnson",
		image: "https://source.unsplash.com/random/?woman,face,1",
		activity: "Cooking Class: Italian Cuisine",
		activityDate: "March 15, 2024",
		matchDate: "2024-03-16T12:34:56",
		lastMessage: "That was such a fun class! Would love to meet up again.",
		unreadCount: 1,
	},
];

export default function Dashboard() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("upcoming");
	const [showParticipantsDialog, setShowParticipantsDialog] = useState(false);
	const [currentActivity, setCurrentActivity] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [participants, setParticipants] = useState<Record<string, unknown>[]>(
		[]
	);
	const [showChatDialog, setShowChatDialog] = useState(false);
	const [currentMatch, setCurrentMatch] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [messages, setMessages] = useState<{ text: string; sender: string; time: string }[]>(() => {
		// Initialize with greeting and match reply if available
		const initial: { text: string; sender: string; time: string }[] = [
			{
				text: 'Hi! It was great meeting you at the activity!',
				sender: 'user',
				time: '2 days ago',
			},
		];
		if (matches[0]?.lastMessage) {
			initial.push({
				text: matches[0].lastMessage,
				sender: 'match',
				time: 'Mar 16',
			});
		}
		return initial;
	});
	const [newMessage, setNewMessage] = useState("");

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

	// Format date for relative time (e.g., "2 days ago")
	const formatRelativeTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMs = now.getTime() - date.getTime();
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
			if (diffInHours === 0) {
				const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
				return diffInMinutes <= 1
					? "Just now"
					: `${diffInMinutes} minutes ago`;
			}
			return diffInHours === 1
				? "1 hour ago"
				: `${diffInHours} hours ago`;
		} else if (diffInDays === 1) {
			return "Yesterday";
		} else if (diffInDays < 7) {
			return `${diffInDays} days ago`;
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	};

	const handleViewActivity = (activityId: string) => {
		router.push(`/activities/${activityId}`);
	};

	const handleViewParticipants = (activity: Record<string, unknown>) => {
		setCurrentActivity(activity);
		setParticipants(activity.participants as Record<string, unknown>[]);
		setShowParticipantsDialog(true);
	};

	const handleLikeParticipant = (participantId: string) => {
		setParticipants((prev) =>
			prev.map((p) =>
				p.id === participantId ? { ...p, liked: !p.liked } : p
			)
		);

		// Simulate a match (in a real app, this would be handled by the backend)
		const participant = participants.find((p) => p.id === participantId);
		if (participant && !participant.liked) {
			// 30% chance of a match
			if (Math.random() < 0.3) {
				setTimeout(() => {
					toast.success(
						`It's a match! You and ${participant.name} liked each other.`
					);

					// Add to matches (in a real app, this would be handled by the backend)
					matches.push({
						id: `m${matches.length + 1}`,
						name:
							typeof participant.name === "string"
								? participant.name
								: "Unknown name",
						image:
							typeof participant.image === "string"
								? participant.image
								: "No image",
						activity:
							typeof currentActivity?.title === "string"
								? currentActivity.title
								: "Unknown Activity",
						activityDate: new Date().toLocaleDateString("en-US", {
							month: "long",
							day: "numeric",
							year: "numeric",
						}),
						matchDate: new Date().toISOString(),
						lastMessage: "",
						unreadCount: 0,
					});
				}, 1000);
			}
		}
	};

	const handleOpenChat = (match: Record<string, unknown>) => {
		setCurrentMatch(match);
		setShowChatDialog(true);
	};

	const handleFindActivities = () => {
		router.push("/activities");
	};

	const handleSendMessage = () => {
		if (newMessage.trim() !== "") {
			setMessages([
				...messages,
				{ text: newMessage, sender: "user", time: "just now" },
			]);
			setNewMessage("");
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
				<h1 className="text-3xl font-bold mb-4 md:mb-0">My Amora</h1>
				<Button onClick={handleFindActivities}>
					Find New Activities
				</Button>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<TabsList className="grid grid-cols-3 mb-8">
					<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					<TabsTrigger value="past">Past Activities</TabsTrigger>
					<TabsTrigger value="matches">My Matches</TabsTrigger>
				</TabsList>

				<TabsContent value="upcoming" className="space-y-6">
					{upcomingActivities.length > 0 ? (
						upcomingActivities.map((activity) => (
							<Card key={activity.id}>
								<div className="md:flex">
									<div className="md:w-1/4 h-48 md:h-auto relative">
										<img
											src={activity.image}
											alt={activity.title}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="md:w-3/4">
										<CardHeader>
											<div className="flex justify-between items-start">
												<div>
													<CardTitle>
														{activity.title}
													</CardTitle>
													<CardDescription>
														{activity.type} •{" "}
														{activity.location}
													</CardDescription>
												</div>
												<div className="text-right">
													<span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
														Confirmed
													</span>
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div>
													<h3 className="font-medium text-sm mb-1">
														Date & Time
													</h3>
													<p className="text-gray-600">
														{formatDate(
															activity.date
														)}
													</p>
												</div>
												<div>
													<h3 className="font-medium text-sm mb-1">
														Location
													</h3>
													<p className="text-gray-600">
														{activity.address}
													</p>
												</div>
												<div>
													<h3 className="font-medium text-sm mb-1">
														Participants
													</h3>
													<p className="text-gray-600">
														{activity.participants}{" "}
														people are attending
													</p>
												</div>
											</div>
										</CardContent>
										<CardFooter className="flex justify-between">
											<Button
												variant="outline"
												onClick={() =>
													handleViewActivity(
														activity.id
													)
												}
											>
												View Details
											</Button>
											<Button>Get Directions</Button>
										</CardFooter>
									</div>
								</div>
							</Card>
						))
					) : (
						<div className="text-center py-12 border rounded-xl bg-gray-50">
							<h2 className="text-xl font-semibold mb-2">
								No upcoming activities
							</h2>
							<p className="text-gray-500 mb-6">
								{
									"You haven't signed up for any activities yet."
								}
							</p>
							<Button onClick={handleFindActivities}>
								Browse Activities
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="past" className="space-y-6">
					{pastActivities.length > 0 ? (
						pastActivities.map((activity) => (
							<Card key={activity.id}>
								<div className="md:flex">
									<div className="md:w-1/4 h-48 md:h-auto relative">
										<img
											src={activity.image}
											alt={activity.title}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="md:w-3/4">
										<CardHeader>
											<div className="flex justify-between items-start">
												<div>
													<CardTitle>
														{activity.title}
													</CardTitle>
													<CardDescription>
														{activity.type} •{" "}
														{activity.location} •{" "}
														{formatDate(
															activity.date
														)}
													</CardDescription>
												</div>
												<div className="text-right">
													<span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
														Completed
													</span>
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<p className="mb-4">
												{activity.description}
											</p>
											<div>
												<h3 className="font-medium text-sm mb-2">
													People you met
												</h3>
												<div className="flex flex-wrap -mx-1">
													{activity.participants
														?.slice(0, 4)
														.map((participant) => (
															<div
																key={
																	participant.id
																}
																className="px-1 mb-2"
															>
																<Avatar className="h-8 w-8">
																	<AvatarImage
																		src={
																			participant.image
																		}
																		alt={
																			participant.name
																		}
																	/>
																	<AvatarFallback>
																		{participant.name.charAt(
																			0
																		)}
																	</AvatarFallback>
																</Avatar>
															</div>
														))}
													{activity.participants
														?.length > 4 && (
														<div className="px-1 mb-2 flex items-center text-sm text-gray-500">
															+
															{activity
																.participants
																.length -
																4}{" "}
															more
														</div>
													)}
												</div>
											</div>
										</CardContent>
										<CardFooter>
											<Button
												onClick={() =>
													handleViewParticipants(
														activity
													)
												}
											>
												Rate Participants
											</Button>
										</CardFooter>
									</div>
								</div>
							</Card>
						))
					) : (
						<div className="text-center py-12 border rounded-xl bg-gray-50">
							<h2 className="text-xl font-semibold mb-2">
								No past activities
							</h2>
							<p className="text-gray-500 mb-6">
								{
									"When you attend activities, they'll appear here."
								}
							</p>
							<Button onClick={handleFindActivities}>
								Browse Activities
							</Button>
						</div>
					)}
				</TabsContent>

				<TabsContent value="matches" className="space-y-6">
					{matches.length > 0 ? (
						matches.map((match) => (
							<Card
								key={match.id}
								className="hover:bg-gray-50 cursor-pointer"
								onClick={() => handleOpenChat(match)}
							>
								<CardContent className="p-4 md:p-6">
									<div className="flex items-start space-x-4">
										<Avatar className="h-12 w-12 md:h-16 md:w-16">
											<AvatarImage
												src={match.image}
												alt={match.name}
											/>
											<AvatarFallback>
												{match.name.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1 min-w-0">
											<div className="flex justify-between">
												<h3 className="text-base md:text-lg font-semibold">
													{match.name}
												</h3>
												<span className="text-xs text-gray-500">
													{formatRelativeTime(
														match.matchDate
													)}
												</span>
											</div>
											<p className="text-sm text-gray-500">
												Met at: {match.activity} on{" "}
												{match.activityDate}
											</p>
											{match.unreadCount > 0 && (
												<div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
													{match.unreadCount}
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className="text-center py-12 border rounded-xl bg-gray-50">
							<h2 className="text-xl font-semibold mb-2">
								No matches yet
							</h2>
							<p className="text-gray-500 mb-6">
								{
									"When you and someone else both express interest after an activity, you'll be matched and can chat here."
								}
							</p>
							<Button onClick={handleFindActivities}>
								Find Activities
							</Button>
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Participants Dialog */}
			<Dialog
				open={showParticipantsDialog}
				onOpenChange={setShowParticipantsDialog}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Rate Participants</DialogTitle>
						<DialogDescription>
							{"Let us know who you'd like to connect with from"}{" "}
							{currentActivity?.title as string}.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4 space-y-4">
						{participants.map((participant) => (
							<div
								key={participant.id as string}
								className="flex items-center justify-between"
							>
								<div className="flex items-center space-x-3">
									<Avatar>
										<AvatarImage
											src={participant.image as string}
											alt={participant.name as string}
										/>
										<AvatarFallback>
											{typeof participant.name ===
											"string"
												? participant.name.charAt(0)
												: "u"}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">
											{participant.name as string}
										</p>
									</div>
								</div>
								<Button
									variant={
										participant.liked
											? "default"
											: "outline"
									}
									onClick={() =>
										handleLikeParticipant(
											participant.id as string
										)
									}
								>
									{participant.liked ? "Liked" : "Like"}
								</Button>
							</div>
						))}
					</div>

					<DialogFooter>
						<Button
							onClick={() => setShowParticipantsDialog(false)}
						>
							Done
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Chat Dialog */}
			<Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							Chat with {currentMatch?.name as string}
						</DialogTitle>
						<DialogDescription>
							You met at {currentMatch?.activity as string} on{" "}
							{currentMatch?.activityDate as string}
						</DialogDescription>
					</DialogHeader>

					<div className="py-4 h-80 overflow-y-auto border rounded-md p-3 bg-gray-50">
						<div className="flex flex-col space-y-3">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`rounded-lg p-3 w-3/4 ${
										message.sender === 'user'
											? 'bg-white ml-auto'
											: 'bg-blue-50'
									}`}
								>
									<p className="text-sm">{message.text}</p>
									<span
										className={`text-xs text-gray-500 mt-1 block ${
											message.sender === 'user'
												? 'text-right'
												: ''
										}`}
									>
										{message.sender === 'user'
											? `You, ${message.time}`
											: `${currentMatch?.name}, ${message.time}`}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="flex space-x-2">
						<input
							className="flex-1 border rounded-md px-3 py-2"
							placeholder="Type a message..."
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSendMessage();
								}
							}}
						/>
						<Button onClick={handleSendMessage}>Send</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
