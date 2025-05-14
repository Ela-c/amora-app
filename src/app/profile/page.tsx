import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
      <div className="flex flex-col items-center">
        <Link
          href="/profile/personality"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Take the Personality Questionnaire
        </Link>
      </div>
    </div>
  );
} 