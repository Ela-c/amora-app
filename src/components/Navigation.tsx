"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Calendar,
	MessageSquare,
	Users,
	Settings,
	LogOut,
	CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface NavUser {
	name: string;
	firstName?: string;
	image?: string;
}

export function Navigation() {
	const pathname = usePathname();
	const router = useRouter();

	const [user, setUser] = useState<NavUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/auth/me");
				if (response.ok) {
					const userData = await response.json();
					console.log("User data:", userData);
					setUser({
						name: `${userData.firstName} ${userData.lastName}`,
						firstName: userData.firstName,
						image: "https://source.unsplash.com/random/?portrait,person",
					});
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Failed to fetch user in navigation:", error);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUser();
	}, []);

	const isActive = (path: string) => {
		return pathname === path || pathname.startsWith(`${path}/`);
	};

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to logout");
			router.push("/");
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to logout");
		}
	};

	const navItems = [
		{
			name: "Dashboard",
			path: "/dashboard",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			name: "Activities",
			path: "/activities",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			name: "Matches",
			path: "/dashboard?tab=matches",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			name: "Profile",
			path: "/profile",
			icon: <Users className="h-5 w-5" />,
		},
		...(user
			? [
					{
						name: "Our Plans",
						path: "/payment-plans",
						icon: <CreditCard className="h-5 w-5" />,
					},
			  ]
			: []),
		{
			name: "Settings",
			path: "/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	];

	return (
		<header className="border-b">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-6">
					<Link
						href={user ? "/dashboard" : "/"}
						className="text-xl font-bold"
					>
						Amora
					</Link>
					{user && (
						<nav className="hidden md:flex gap-6">
							{navItems.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={`flex items-center gap-2 text-sm font-medium ${
										isActive(item.path)
											? "text-blue-600"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									{item.icon}
									{item.name}
								</Link>
							))}
						</nav>
					)}
				</div>
				{isLoading ? (
					<div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
				) : user ? (
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback>
									{user.name?.charAt(0).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<span className="hidden md:inline text-sm font-medium">
								{user.name}
							</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleLogout}
							aria-label="Log out"
						>
							<LogOut className="h-5 w-5" />
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Button asChild variant="outline">
							<Link href="/auth/login">Login</Link>
						</Button>
						<Button asChild>
							<Link href="/auth/signup">Sign Up</Link>
						</Button>
					</div>
				)}
			</div>
		</header>
	);
}
