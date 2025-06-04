import { currentUser, mockUsers, getTopMatches } from "@/lib/mock-users";
import { UserCard } from "@/components/UserCard";

export default function FindSimilarPage() {
  const topMatches = getTopMatches(currentUser, mockUsers);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Similar People</h1>
        
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
          <div className="flex items-center space-x-4">
            <div className="relative h-20 w-20 rounded-full overflow-hidden">
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentUser.name}</h3>
              <p className="text-gray-600">{currentUser.age} • {currentUser.location}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Top Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topMatches.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
} 