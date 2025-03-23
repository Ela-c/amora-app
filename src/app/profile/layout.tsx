"use client";

import { Navigation } from "@/components/Navigation";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navigation />
			{children}
		</>
	);
}
