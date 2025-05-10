import { PageProps } from "../../../../.next/types/app/page";
import ActivityDetailPageClient from "./client-component";

export default async function ActivityDetailPage({ params }: PageProps) {
	const id = (await params).id;

	return <ActivityDetailPageClient id={id} />;
}
