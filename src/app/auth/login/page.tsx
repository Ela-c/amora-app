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

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			// Here we would typically make an API call to authenticate the user
			// For now, we'll just simulate a login
			// TODO: Implement actual authentication with NextAuth

			setTimeout(() => {
				toast.success("Successfully logged in!");
				router.push("/dashboard");
			}, 1000);
		} catch (error) {
			toast.error("Failed to log in. Please check your credentials.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">
						TimeLeft
					</h1>
					<p className="mt-2 text-lg text-gray-600">
						Sign in to your account
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
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

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</Button>
					</form>
				</Form>

				<div className="mt-6 text-center">
					<p>
						Don&apos;t have an account?{" "}
						<Link
							href="/auth/signup"
							className="font-medium text-blue-600 hover:text-blue-500"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
