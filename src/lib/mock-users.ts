export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  photoUrl: string;
  interests: string[];
  activityPreferences: string[];
}

// Mock current user
export const currentUser: User = {
  id: "current-user",
  name: "Alex Johnson",
  age: 28,
  gender: "Male",
  location: "New York",
  bio: "Adventure seeker and tech enthusiast",
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  interests: ["Cooking", "Travel", "Photography", "Technology", "Music"],
  activityPreferences: ["Hiking", "Yoga", "Swimming", "Reading"]
};

// Mock user database
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    age: 26,
    gender: "Female",
    location: "New York",
    bio: "Foodie and travel blogger",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    interests: ["Cooking", "Travel", "Photography", "Fashion"],
    activityPreferences: ["Yoga", "Swimming", "Dancing"]
  },
  {
    id: "2",
    name: "Michael Park",
    age: 30,
    gender: "Male",
    location: "Boston",
    bio: "Tech entrepreneur and fitness enthusiast",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    interests: ["Technology", "Fitness", "Reading", "Music"],
    activityPreferences: ["Hiking", "Swimming", "Gym"]
  },
  {
    id: "3",
    name: "Emma Wilson",
    age: 27,
    gender: "Female",
    location: "New York",
    bio: "Artist and nature lover",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    interests: ["Art", "Photography", "Nature", "Music"],
    activityPreferences: ["Hiking", "Yoga", "Painting"]
  },
  {
    id: "4",
    name: "David Kim",
    age: 29,
    gender: "Male",
    location: "Chicago",
    bio: "Chef and food critic",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    interests: ["Cooking", "Food", "Travel", "Photography"],
    activityPreferences: ["Cooking", "Swimming", "Reading"]
  },
  {
    id: "5",
    name: "Lisa Martinez",
    age: 25,
    gender: "Female",
    location: "Miami",
    bio: "Dance instructor and fitness coach",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop",
    interests: ["Dance", "Fitness", "Music", "Travel"],
    activityPreferences: ["Dancing", "Yoga", "Swimming"]
  },
  {
    id: "6",
    name: "James Wilson",
    age: 31,
    gender: "Male",
    location: "New York",
    bio: "Software engineer and outdoor enthusiast",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    interests: ["Technology", "Hiking", "Photography", "Music"],
    activityPreferences: ["Hiking", "Swimming", "Reading"]
  }
];

// Calculate Jaccard similarity between two arrays
export function calculateJaccardSimilarity(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Calculate compatibility score between two users
export function calculateCompatibilityScore(user1: User, user2: User): number {
  const interestsSimilarity = calculateJaccardSimilarity(user1.interests, user2.interests);
  const activitiesSimilarity = calculateJaccardSimilarity(user1.activityPreferences, user2.activityPreferences);
  const locationMatch = user1.location === user2.location ? 1 : 0;
  
  return (
    interestsSimilarity * 0.5 +
    activitiesSimilarity * 0.4 +
    locationMatch * 0.1
  );
}

// Get top matches for a user
export function getTopMatches(user: User, users: User[], limit: number = 5): User[] {
  return users
    .filter(u => u.id !== user.id)
    .map(u => ({
      user: u,
      score: calculateCompatibilityScore(user, u)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(match => match.user);
} 