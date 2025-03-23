"use client";

import { Navigation } from "@/components/Navigation";

export default function ActivitiesLayout({
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
