"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
  id: number;
  text: string;
  options: {
    value: number;
    label: string;
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: "I enjoy meeting new people and socializing in groups.",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
  },
  {
    id: 2,
    text: "I prefer planned activities over spontaneous ones.",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
  },
  {
    id: 3,
    text: "I am comfortable with physical touch and affection.",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
  },
  {
    id: 4,
    text: "I enjoy trying new experiences and activities.",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
  },
  {
    id: 5,
    text: "I prefer deep, meaningful conversations over small talk.",
    options: [
      { value: 1, label: "Strongly Disagree" },
      { value: 2, label: "Disagree" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Agree" },
      { value: 5, label: "Strongly Agree" },
    ],
  },
];

export default function PersonalityQuestionnaire() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Personality Answers:', answers);
    setIsSubmitted(true);
  };

  const isFormComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Personality Questionnaire
          </CardTitle>
          <p className="text-center text-gray-500 mt-2">
            Help us understand your personality better to find the perfect matches for you.
          </p>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Thank you for completing the questionnaire!</h2>
              <p className="text-gray-600 mb-6">Your answers have been saved.</p>
              <Button onClick={() => setIsSubmitted(false)}>
                Edit Answers
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {question.id}. {question.text}
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {question.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={`p-2 text-sm rounded-md transition-colors ${
                          answers[question.id] === option.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isFormComplete}
                >
                  Submit Answers
                </Button>
                {!isFormComplete && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Please answer all questions before submitting.
                  </p>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 