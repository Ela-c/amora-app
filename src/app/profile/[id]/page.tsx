import { mockUsers, currentUser, calculateCompatibilityScore } from "@/lib/mock-users";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const user = mockUsers.find((u) => u.id === params.id);
  
  if (!user) {
    notFound();
  }

  const compatibilityScore = calculateCompatibilityScore(currentUser, user);
  const scorePercentage = Math.round(compatibilityScore * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/find-similar" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Matches
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with photo */}
            <div className="relative h-64 w-full">
              <Image
                src={user.photoUrl}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 mt-1">{user.age} • {user.gender} • {user.location}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium">
                  {scorePercentage}% Match
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-gray-700">{user.bio}</p>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Activity Preferences</h2>
                <div className="flex flex-wrap gap-2">
                  {user.activityPreferences.map((activity) => (
                    <span
                      key={activity}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connect Button */}
              <div className="flex justify-center">
                <Link href={`/chat/${user.id}`}>
                  <Button size="lg" className="px-12 py-6 text-lg">
                    Connect
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 