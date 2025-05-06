"use client";

import { Navigation } from "@/components/Navigation";
import { UserDataAccess } from "@/persistance/user-data-access";
import { cookies } from "next/headers";
import { useRouter } from "next/router";

export default async function DashboardLayout({
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
