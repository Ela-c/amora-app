"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
	// Personal info
	age: z.string().min(1, { message: "Age is required" }),
	gender: z.string().min(1, { message: "Gender is required" }),
	location: z.string().min(1, { message: "Location is required" }),
	occupation: z.string().min(1, { message: "Occupation is required" }),

	// Personality
	bio: z.string().min(10, { message: "Bio must be at least 10 characters" }),
	interests: z
		.array(z.string())
		.min(1, { message: "Select at least one interest" }),

	// Activity preferences
	activityPreferences: z
		.array(z.string())
		.min(1, { message: "Select at least one activity type" }),

	// Photo
	profilePhoto: z.any().optional(),
});

// Available interests
const interests = [
	"Reading",
	"Hiking",
	"Cooking",
	"Travel",
	"Movies",
	"Music",
	"Art",
	"Sports",
	"Photography",
	"Fitness",
	"Technology",
	"Gaming",
	"Dancing",
	"Writing",
	"Fashion",
];

// Available activity types
const activityTypes = [
	"Dinner",
	"Coffee",
	"Drinks",
	"Hiking",
	"Museum",
	"Concert",
	"Movie",
	"Theater",
	"Sports Game",
	"Beach",
	"Yoga",
	"Cooking Class",
	"Art Gallery",
	"Wine Tasting",
];

export default function ProfileSetupPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("personal");
	const [isLoading, setIsLoading] = useState(false);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			age: "",
			gender: "",
			location: "",
			occupation: "",
			bio: "",
			interests: [],
			activityPreferences: [],
			profilePhoto: undefined,
		},
	});

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string);
				form.setValue("profilePhoto", file);
			};
			reader.readAsDataURL(file);
		}
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			// Here we would typically make an API call to save the profile data
			// For now, we'll just simulate the save process

			setTimeout(() => {
				toast.success("Profile setup completed!");
				router.push("/dashboard");
			}, 1500);
		} catch (error) {
			toast.error("Failed to save profile. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	const nextTab = () => {
		if (activeTab === "personal") {
			// Validate personal info before moving to next tab
			form.trigger(["age", "gender", "location", "occupation"]);
			const hasErrors =
				!!form.formState.errors.age ||
				!!form.formState.errors.gender ||
				!!form.formState.errors.location ||
				!!form.formState.errors.occupation;

			if (!hasErrors) {
				setActiveTab("personality");
			}
		} else if (activeTab === "personality") {
			// Validate personality info before moving to next tab
			form.trigger(["bio", "interests"]);
			const hasErrors =
				!!form.formState.errors.bio ||
				!!form.formState.errors.interests;

			if (!hasErrors) {
				setActiveTab("activities");
			}
		} else if (activeTab === "activities") {
			// Validate activity preferences before moving to photo upload
			form.trigger(["activityPreferences"]);
			const hasErrors = !!form.formState.errors.activityPreferences;

			if (!hasErrors) {
				setActiveTab("photo");
			}
		}
	};

	const prevTab = () => {
		if (activeTab === "personality") {
			setActiveTab("personal");
		} else if (activeTab === "activities") {
			setActiveTab("personality");
		} else if (activeTab === "photo") {
			setActiveTab("activities");
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">
						Complete Your Profile
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						Tell us more about yourself to help us match you with
						the right activities and people.
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="personal">Personal</TabsTrigger>
						<TabsTrigger value="personality">
							Personality
						</TabsTrigger>
						<TabsTrigger value="activities">Activities</TabsTrigger>
						<TabsTrigger value="photo">Photo</TabsTrigger>
					</TabsList>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6 mt-6"
						>
							<TabsContent value="personal" className="space-y-6">
								<FormField
									control={form.control}
									name="age"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Age</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Your age"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="gender"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Gender</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="male">
														Male
													</SelectItem>
													<SelectItem value="female">
														Female
													</SelectItem>
													<SelectItem value="non-binary">
														Non-binary
													</SelectItem>
													<SelectItem value="other">
														Other
													</SelectItem>
													<SelectItem value="prefer-not-to-say">
														Prefer not to say
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Location</FormLabel>
											<FormControl>
												<Input
													placeholder="City, Country"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="occupation"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Occupation</FormLabel>
											<FormControl>
												<Input
													placeholder="Your occupation"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-end mt-6">
									<Button type="button" onClick={nextTab}>
										Next: Personality
									</Button>
								</div>
							</TabsContent>

							<TabsContent
								value="personality"
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="bio"
									render={({ field }) => (
										<FormItem>
											<FormLabel>About You</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Tell us about yourself, your passions, and what you're looking for..."
													className="min-h-32"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												This helps others get to know
												you better.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="interests"
									render={() => (
										<FormItem>
											<div className="mb-4">
												<FormLabel>Interests</FormLabel>
												<FormDescription>
													Select all that apply to
													you.
												</FormDescription>
											</div>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{interests.map((interest) => (
													<FormField
														key={interest}
														control={form.control}
														name="interests"
														render={({ field }) => {
															return (
																<FormItem
																	key={
																		interest
																	}
																	className="flex flex-row items-start space-x-3 space-y-0"
																>
																	<FormControl>
																		<Checkbox
																			checked={field.value?.includes(
																				interest
																			)}
																			onCheckedChange={(
																				checked
																			) => {
																				return checked
																					? field.onChange(
																							[
																								...field.value,
																								interest,
																							]
																					  )
																					: field.onChange(
																							field.value?.filter(
																								(
																									value
																								) =>
																									value !==
																									interest
																							)
																					  );
																			}}
																		/>
																	</FormControl>
																	<FormLabel className="font-normal">
																		{
																			interest
																		}
																	</FormLabel>
																</FormItem>
															);
														}}
													/>
												))}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-between mt-6">
									<Button
										type="button"
										variant="outline"
										onClick={prevTab}
									>
										Previous
									</Button>
									<Button type="button" onClick={nextTab}>
										Next: Activities
									</Button>
								</div>
							</TabsContent>

							<TabsContent
								value="activities"
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="activityPreferences"
									render={() => (
										<FormItem>
											<div className="mb-4">
												<FormLabel>
													Activity Preferences
												</FormLabel>
												<FormDescription>
													What types of activities are
													you interested in?
												</FormDescription>
											</div>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{activityTypes.map(
													(activity) => (
														<FormField
															key={activity}
															control={
																form.control
															}
															name="activityPreferences"
															render={({
																field,
															}) => {
																return (
																	<FormItem
																		key={
																			activity
																		}
																		className="flex flex-row items-start space-x-3 space-y-0"
																	>
																		<FormControl>
																			<Checkbox
																				checked={field.value?.includes(
																					activity
																				)}
																				onCheckedChange={(
																					checked
																				) => {
																					return checked
																						? field.onChange(
																								[
																									...field.value,
																									activity,
																								]
																						  )
																						: field.onChange(
																								field.value?.filter(
																									(
																										value
																									) =>
																										value !==
																										activity
																								)
																						  );
																				}}
																			/>
																		</FormControl>
																		<FormLabel className="font-normal">
																			{
																				activity
																			}
																		</FormLabel>
																	</FormItem>
																);
															}}
														/>
													)
												)}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-between mt-6">
									<Button
										type="button"
										variant="outline"
										onClick={prevTab}
									>
										Previous
									</Button>
									<Button type="button" onClick={nextTab}>
										Next: Photo
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="photo" className="space-y-6">
								<div className="space-y-4">
									<FormLabel>Profile Photo</FormLabel>
									<FormDescription>
										Upload a clear photo of yourself.
									</FormDescription>

									<div className="flex flex-col items-center space-y-4">
										{photoPreview ? (
											<div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200">
												<Image
													src={photoPreview}
													alt="Profile preview"
													fill
													style={{
														objectFit: "cover",
													}}
												/>
											</div>
										) : (
											<div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center">
												<span className="text-gray-400">
													No photo
												</span>
											</div>
										)}

										<Input
											type="file"
											accept="image/*"
											onChange={handlePhotoChange}
											className="max-w-xs"
										/>
									</div>
								</div>

								<div className="flex justify-between mt-6">
									<Button
										type="button"
										variant="outline"
										onClick={prevTab}
									>
										Previous
									</Button>
									<Button type="submit" disabled={isLoading}>
										{isLoading
											? "Completing setup..."
											: "Complete profile setup"}
									</Button>
								</div>
							</TabsContent>
						</form>
					</Form>
				</Tabs>
			</div>
		</div>
	);
}
