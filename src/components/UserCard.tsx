import { User } from "@/lib/mock-users";
import { calculateCompatibilityScore } from "@/lib/mock-users";
import { currentUser } from "@/lib/mock-users";
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const compatibilityScore = calculateCompatibilityScore(currentUser, user);
  const scorePercentage = Math.round(compatibilityScore * 100);

  return (
    <Link href={`/profile/${user.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={user.photoUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {scorePercentage}% Match
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-2">{user.age} • {user.location}</p>
          <p className="text-gray-700 mb-3 line-clamp-2">{user.bio}</p>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Interests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Activities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.activityPreferences.map((activity) => (
                  <span
                    key={activity}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 