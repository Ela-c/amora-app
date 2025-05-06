"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PasswordSchema } from "@/models/user";

const formSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email("Invalid email address"),
		password: PasswordSchema,
		confirmPassword: PasswordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export default function SignupPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: FormData) {
		setIsLoading(true);

		try {
			const response = await fetch("/api/auth/sign-up", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: values.firstName,
					lastName: values.lastName,
					email: values.email,
					password: values.password,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create account");
			}

			toast.success("Account created successfully!");
			router.push("/profile/setup");
		} catch (error) {
			toast.error("Failed to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">Amora</h1>
					<p className="mt-2 text-lg text-gray-600">
						Create your account
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="email@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading
								? "Creating account..."
								: "Create account"}
						</Button>
					</form>
				</Form>

				<div className="mt-6 text-center">
					<p>
						Already have an account?{" "}
						<Link
							href="/auth/login"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
