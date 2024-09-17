"use client";
import { SetStateAction, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { sendMessage } from '../_utils/generativeAI'; 
import Link from 'next/link';// Importing sendMessage

export default function Savings() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false); // For handling loading state

  const handleCalculate = () => {
    const remainingAmount = parseFloat(income) - parseFloat(expenses);
    setSavings(remainingAmount.toFixed(2));
    setAiSuggestion(
      "Based on your current income and expenses, I suggest saving 20% of your remaining amount. This would be $" +
        (remainingAmount * 0.2).toFixed(2) +
        " per month."
    );
  };

  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return;

    setLoading(true);
    try {
      const response = await sendMessage(userQuestion); // Use sendMessage utility
      setAiResponse(response);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Sorry, I encountered an issue processing your request.');
    } finally {
      setLoading(false);
      setUserQuestion('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-sky-400 p-8">
         <Link href="/">Home</Link>
      <h1 className="text-4xl font-bold mb-8 text-center">Savings & Budget Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gray-900 border-sky-400">
          <CardHeader>
            <CardTitle className="text-sky-400">Income & Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="income" className="block mb-2">Monthly Income</label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="bg-gray-800 text-sky-400 border-sky-400"
                />
              </div>
              <div>
                <label htmlFor="expenses" className="block mb-2">Monthly Expenses</label>
                <Input
                  id="expenses"
                  type="number"
                  placeholder="Enter your monthly expenses"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="bg-gray-800 text-sky-400 border-sky-400"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-sky-400">
          <CardHeader>
            <CardTitle className="text-sky-400">Savings Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              Remaining Amount: ${savings}
            </div>
            <div className="bg-gray-800 p-4 rounded-md mb-4">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <MessageSquare className="mr-2" /> AI Suggestion
              </h3>
              <p>{aiSuggestion}</p>
            </div>
            <div className="space-y-4">
              <Textarea
                placeholder="Ask for more financial advice..."
                value={userQuestion}
                onChange={(e: { target: { value: SetStateAction<string> } }) => setUserQuestion(e.target.value)}
                className="bg-gray-800 text-sky-400 border-sky-400"
              />
              <Button
                onClick={handleAskQuestion}
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center"
              >
                {loading ? 'Getting Advice...' : (
                  <>
                    <Send className="mr-2" /> Get Advice
                  </>
                )}
              </Button>
              {aiResponse && (
                <div className="bg-gray-800 p-4 rounded-md mt-4 text-white">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <MessageSquare className="mr-2" /> AI Response
                  </h3>
                  <p>{aiResponse}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}