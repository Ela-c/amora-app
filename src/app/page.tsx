import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navigation */}
			<header className="border-b">
				<div className="container flex h-16 items-center justify-between">
					<div className="flex items-center gap-6">
						<Link href="/" className="text-xl font-bold">
							TimeLeft
						</Link>
					</div>
					<nav className="flex gap-4">
						<Link
							href="/auth/login"
							className="text-sm font-medium hover:underline"
						>
							Log in
						</Link>
						<Link href="/auth/signup">
							<Button>Sign up</Button>
						</Link>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="flex-1">
				<div className="container flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
					<div className="space-y-4">
						<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
							Meet New People Through{" "}
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
								Shared Activities
							</span>
						</h1>
						<p className="max-w-[600px] text-gray-500 md:text-xl">
							Join dinners, hikes, cooking classes, and more to
							connect with like-minded individuals in your area.
						</p>
					</div>
					<div className="flex flex-col gap-4 sm:flex-row">
						<Link href="/auth/signup">
							<Button size="lg" className="px-8">
								Get Started
							</Button>
						</Link>
						<Link href="/activities">
							<Button
								size="lg"
								variant="outline"
								className="px-8"
							>
								Browse Activities
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Feature Section */}
			<section className="border-t bg-gray-50 py-16">
				<div className="container space-y-12">
					<div className="text-center">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							How It Works
						</h2>
						<p className="mt-4 text-gray-500">
							Three simple steps to start meeting new people and
							making connections.
						</p>
					</div>
					<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
						<div className="flex flex-col items-center text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
								1
							</div>
							<h3 className="text-xl font-bold">Sign Up</h3>
							<p className="mt-2 text-gray-500">
								Create your profile and tell us about your
								interests and preferences.
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
								2
							</div>
							<h3 className="text-xl font-bold">
								Join Activities
							</h3>
							<p className="mt-2 text-gray-500">
								Browse and join activities that match your
								interests and schedule.
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
								3
							</div>
							<h3 className="text-xl font-bold">Connect</h3>
							<p className="mt-2 text-gray-500">
								Meet people at activities and stay in touch with
								those you click with.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16">
				<div className="container">
					<div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-center text-white">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
							Ready to meet new people?
						</h2>
						<p className="mt-4 text-white/90">
							Join thousands of others who are expanding their
							social circles through shared activities.
						</p>
						<div className="mt-8">
							<Link href="/auth/signup">
								<Button
									size="lg"
									className="bg-white text-blue-600 hover:bg-white/90"
								>
									Sign Up Now
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t py-8">
				<div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
					<p className="text-sm text-gray-500">
						© 2024 TimeLeft. All rights reserved.
					</p>
					<div className="flex gap-4">
						<Link
							href="/terms"
							className="text-sm text-gray-500 hover:underline"
						>
							Terms of Service
						</Link>
						<Link
							href="/privacy"
							className="text-sm text-gray-500 hover:underline"
						>
							Privacy Policy
						</Link>
						<Link
							href="/contact"
							className="text-sm text-gray-500 hover:underline"
						>
							Contact
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
