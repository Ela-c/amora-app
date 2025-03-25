"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Calendar,
	MessageSquare,
	Users,
	Settings,
	LogOut,
} from "lucide-react";

export function Navigation() {
	const pathname = usePathname();

	// Mock user data (would come from auth context in a real app)
	const user = {
		name: "John Doe",
		image: "https://source.unsplash.com/random/?portrait,person",
	};

	const isActive = (path: string) => {
		return pathname === path || pathname.startsWith(`${path}/`);
	};

	const handleLogout = () => {
		// Here you would implement actual logout logic
		window.location.href = "/";
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
					<Link href="/" className="text-xl font-bold">
						Amora
					</Link>
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
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={user.image} alt={user.name} />
							<AvatarFallback>
								{user.name.charAt(0)}
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
			</div>
		</header>
	);
}
