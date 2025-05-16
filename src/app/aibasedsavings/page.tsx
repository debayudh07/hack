"use client"
import { SetStateAction, useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Menu, X, DollarSign, PieChart, TrendingUp, Home, Info, Phone } from "lucide-react"
import { sendMessage } from '../_utils/generativeAI'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

export default function Savings() {
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [savings, setSavings] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [userQuestion, setUserQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [savingsGoal, setSavingsGoal] = useState('')
  const [savingsTimeframe, setSavingsTimeframe] = useState('')
  const [monthlySavingsNeeded, setMonthlySavingsNeeded] = useState('')
  const [savePercent, setSavePercent] = useState(20)

  // Calculate savings and get AI suggestions
  const handleCalculate = async () => {
    if (!income || !expenses) {
      setAiSuggestion("Please enter both income and expenses to receive personalized advice.")
      return
    }

    const remainingAmount = parseFloat(income) - parseFloat(expenses)
    const savingsAmount = (remainingAmount * (savePercent / 100)).toFixed(2)
    setSavings(remainingAmount.toFixed(2))

    // Get AI suggestion based on financial data
    setLoading(true)
    try {
      const question = `Based on my monthly income of $${income} and expenses of $${expenses}, 
      leaving me with $${remainingAmount.toFixed(2)} remaining, what's your suggestion for how 
      much I should save and what strategies would you recommend for my situation?`
      
      const response = await sendMessage(question, {
        income,
        expenses,
        savings: remainingAmount.toFixed(2)
      })
      
      setAiSuggestion(response)
    } catch (error) {
      console.error('Error fetching AI suggestion:', error)
      setAiSuggestion(`I recommend saving ${savePercent}% of your remaining amount, which would be $${savingsAmount} per month.`)
    } finally {
      setLoading(false)
    }
  }

  // Calculate savings goal timeline
  const calculateSavingsGoal = () => {
    if (!savings || !savingsGoal || !savingsTimeframe) return
    
    const monthlyAmount = parseFloat(savingsGoal) / parseFloat(savingsTimeframe)
    setMonthlySavingsNeeded(monthlyAmount.toFixed(2))
  }

  // Handle asking custom questions
  const handleAskQuestion = async () => {
    if (!userQuestion.trim()) return

    setLoading(true)
    try {
      // Send the financial context with the question
      const response = await sendMessage(userQuestion, {
        income,
        expenses,
        savings
      })
      setAiResponse(response)
    } catch (error) {
      console.error('Error fetching AI response:', error)
      setAiResponse('Sorry, I encountered an issue processing your request.')
    } finally {
      setLoading(false)
      setUserQuestion('')
    }
  }

  // Update savings suggestion when save percent changes
  useEffect(() => {
    if (savings) {
      const savingsAmount = (parseFloat(savings) * (savePercent / 100)).toFixed(2)
      setAiSuggestion(`I recommend saving ${savePercent}% of your remaining amount, which would be $${savingsAmount} per month.`)
    }
  }, [savePercent, savings])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <nav className="backdrop-blur-md bg-black/40 p-4 sticky top-0 z-10 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <DollarSign className="mr-2 text-emerald-400" />
            </motion.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">SavingsAI</span>
          </Link>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
            </button>
          </div>
          <motion.ul 
            className={`md:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 bg-black/90 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <li className="py-2 md:py-0"><Link href="/" className="hover:text-emerald-400 transition-colors duration-200 flex items-center"><Home className="mr-2 h-4 w-4" /> Home</Link></li>
            <li className="py-2 md:py-0"><Link href="/about" className="hover:text-emerald-400 transition-colors duration-200 flex items-center"><Info className="mr-2 h-4 w-4" /> About</Link></li>
            <li className="py-2 md:py-0"><Link href="/contact" className="hover:text-emerald-400 transition-colors duration-200 flex items-center"><Phone className="mr-2 h-4 w-4" /> Contact</Link></li>
          </motion.ul>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-blue-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Savings & Budget Planner
        </motion.h1>

        <Tabs defaultValue="calculator" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 p-1 rounded-xl">
            <TabsTrigger value="calculator" className="text-lg rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <DollarSign className="mr-2 h-4 w-4" /> Calculator
            </TabsTrigger>
            <TabsTrigger value="advisor" className="text-lg rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <MessageSquare className="mr-2 h-4 w-4" /> AI Advisor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Main Income Card - Spans 2 columns */}
              <motion.div variants={fadeInUp} className="md:col-span-2 row-span-1">
                <Card className="h-full bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 border-0">
                  <CardHeader className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 pb-6">
                    <CardTitle className="text-white flex items-center text-xl font-bold">
                      <PieChart className="mr-2 text-emerald-400" /> Income & Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label htmlFor="income" className="block text-white text-sm font-medium">Monthly Income</label>
                        <Input
                          id="income"
                          type="number"
                          placeholder="Enter your monthly income"
                          value={income}
                          onChange={(e) => setIncome(e.target.value)}
                          className="bg-gray-700/50 text-white border-white/20 rounded-xl transition-colors duration-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="expenses" className="block text-white text-sm font-medium">Monthly Expenses</label>
                        <Input
                          id="expenses"
                          type="number"
                          placeholder="Enter your monthly expenses"
                          value={expenses}
                          onChange={(e) => setExpenses(e.target.value)}
                          className="bg-gray-700/50 text-white border-white/20 rounded-xl transition-colors duration-200 focus:border-emerald-500"
                        />
                      </div>
                      <Button 
                        onClick={handleCalculate} 
                        className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl py-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
                        disabled={loading}
                      >
                        {loading ? 'Calculating...' : 'Calculate & Get Advice'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Save Percentage Slider */}
              <motion.div variants={fadeInUp} className="md:col-span-1">
                <Card className="h-full bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-900/40 to-blue-900/20 pb-4">
                    <CardTitle className="text-white flex items-center text-xl font-bold">
                      <TrendingUp className="mr-2 text-blue-400" /> Save Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col justify-center h-full">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold text-white">{savePercent}%</span>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="savePercent" className="block text-white text-sm font-medium text-center">
                        Savings Percentage
                      </label>
                      <input
                        id="savePercent"
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={savePercent}
                        onChange={(e) => setSavePercent(parseInt(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                      <div className="flex justify-between text-xs text-white/70">
                        <span>5%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Savings Summary - Shows after calculation */}
              {savings && (
                <motion.div 
                  variants={fadeInUp} 
                  className="md:col-span-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border-0">
                    <CardHeader className="bg-gradient-to-r from-purple-900/40 to-blue-900/20 pb-4">
                      <CardTitle className="text-white flex items-center text-xl font-bold">
                        <DollarSign className="mr-2 text-purple-400" /> Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-white/80">Income:</span>
                          <span className="text-emerald-400 font-bold">${income}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Expenses:</span>
                          <span className="text-red-400 font-bold">${expenses}</span>
                        </div>
                        <div className="h-px bg-white/10 my-2"></div>
                        <div className="flex justify-between">
                          <span className="text-white font-medium">Available:</span>
                          <span className="text-blue-400 font-bold">${savings}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Savings Goal Card */}
              <motion.div variants={fadeInUp} className="md:col-span-2">
                <Card className="h-full bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-blue-500/10 transition-all duration-500 border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-900/40 to-blue-900/20 pb-4">
                    <CardTitle className="text-white flex items-center text-xl font-bold">
                      <TrendingUp className="mr-2 text-blue-400" /> Savings Goal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="savingsGoal" className="block text-white text-sm font-medium">Goal Amount</label>
                        <Input
                          id="savingsGoal"
                          type="number"
                          placeholder="Enter amount you want to save"
                          value={savingsGoal}
                          onChange={(e) => setSavingsGoal(e.target.value)}
                          className="bg-gray-700/50 text-white border-white/20 rounded-xl transition-colors duration-200 focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="savingsTimeframe" className="block text-white text-sm font-medium">Timeframe (months)</label>
                        <Input
                          id="savingsTimeframe"
                          type="number"
                          placeholder="Number of months to reach goal"
                          value={savingsTimeframe}
                          onChange={(e) => setSavingsTimeframe(e.target.value)}
                          className="bg-gray-700/50 text-white border-white/20 rounded-xl transition-colors duration-200 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={calculateSavingsGoal} 
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-5 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                    >
                      Calculate Monthly Savings
                    </Button>
                    
                    {monthlySavingsNeeded && (
                      <motion.div 
                        className="bg-gray-700/40 p-4 rounded-xl mt-4 border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="font-medium text-white/90">To reach ${savingsGoal} in {savingsTimeframe} months:</p>
                        <p className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                          ${monthlySavingsNeeded}/month
                        </p>
                        
                        {parseFloat(monthlySavingsNeeded) > parseFloat(savings) && (
                          <p className="text-yellow-300 mt-2 flex items-center text-sm">
                            <span className="mr-1">⚠️</span> This exceeds your available monthly savings of ${savings}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Suggestion Card */}
              {aiSuggestion && (
                <motion.div 
                  variants={fadeInUp} 
                  className="md:col-span-2 lg:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="h-full bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 border-0">
                    <CardHeader className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 pb-4">
                      <CardTitle className="text-white flex items-center text-xl font-bold">
                        <MessageSquare className="mr-2 text-emerald-400" /> Personalized Advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="prose prose-invert max-w-none text-white">
                        {aiSuggestion.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="advisor">
            <motion.div 
              className="grid grid-cols-1 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeInUp}>
                <Card className="bg-gray-800/30 border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 border-0">
                  <CardHeader className="bg-gradient-to-r from-emerald-900/40 to-blue-900/40 pb-4">
                    <CardTitle className="text-white flex items-center text-xl font-bold">
                      <MessageSquare className="mr-2 text-emerald-400" /> AI Financial Advisor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {aiSuggestion && (
                      <motion.div 
                        className="bg-gray-700/40 p-6 rounded-xl mb-8 border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3 className="text-xl font-semibold mb-3 flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
                          <MessageSquare className="mr-2 text-emerald-400" /> Personalized Advice
                        </h3>
                        <div className="prose prose-invert max-w-none text-white">
                          {aiSuggestion.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Ask for financial advice (e.g., 'How can I save more for retirement?' or 'What's a good emergency fund size?')"
                        value={userQuestion}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setUserQuestion(e.target.value)}
                        className="bg-gray-700/50 text-white border-white/20 rounded-xl transition-colors duration-200 focus:border-emerald-500 h-28"
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white flex items-center justify-center rounded-xl py-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
                      >
                        {loading ? 'Getting Advice...' : (
                          <>
                            <Send className="mr-2" /> Get Financial Advice
                          </>
                        )}
                      </Button>
                      
                      {aiResponse && (
                        <motion.div 
                          className="bg-gray-700/40 p-6 rounded-xl mt-6 border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="text-xl font-semibold mb-3 flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            <MessageSquare className="mr-2 text-blue-400" /> AI Response
                          </h3>
                          <div className="prose prose-invert max-w-none text-white">
                            {aiResponse.split('\n').map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}