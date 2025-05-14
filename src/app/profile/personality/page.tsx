'use client';
import { useState } from 'react';

const questions = [
  'I enjoy meeting new people and socializing in groups.',
  'I prefer planned activities over spontaneous ones.',
  'I am comfortable with physical touch and affection.',
  'I enjoy trying new experiences and activities.',
  'I prefer deep, meaningful conversations over small talk.'
];

const likertLabels = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

export default function PersonalityPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(3));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, valIdx: number) => {
    setAnswers((prev) => prev.map((a, i) => (i === qIdx ? valIdx + 1 : a)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Personality Questionnaire</h1>
        <p className="text-center text-gray-500 mb-8">
          Help us understand your personality better to find the perfect matches for you.
        </p>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-center">Thank you for completing the questionnaire!</h2>
            <p className="text-gray-600 text-center mb-6">Your answers have been saved.</p>
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-black text-white rounded font-medium hover:bg-gray-900 transition"
            >
              Edit Answers
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q, qIdx) => (
              <div key={qIdx}>
                <p className="mb-3 font-semibold text-lg">
                  {qIdx + 1}. {q}
                </p>
                <div className="flex justify-between gap-2">
                  {likertLabels.map((label, valIdx) => {
                    const selected = answers[qIdx] === valIdx + 1;
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => handleSelect(qIdx, valIdx)}
                        className={`flex-1 px-2 py-2 rounded-lg font-medium text-xs md:text-sm transition
                          ${selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}
                          focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-900 transition"
            >
              Submit Answers
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 