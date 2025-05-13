"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h2 className="text-xl font-semibold mb-2">Personality Assessment</h2>
              <p className="text-gray-600">
                Complete the personality questionnaire to help us find better matches for you.
              </p>
            </div>
            <Link href="/profile/personality">
              <Button>
                Take the Personality Questionnaire
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 