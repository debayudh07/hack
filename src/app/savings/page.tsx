"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useAccount } from "wagmi"
import Link from "next/link"
import { contractAddress, contractABI } from "@/contract/contracts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, RefreshCw, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface SavingsGoal {
  name: string
  current: bigint
  target: bigint
}

export default function SavingsGoalsPage() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [newGoal, setNewGoal] = useState({
    name: "",
    current: "",
    target: "",
  })
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const initializeContract = async () => {
      if (isConnected && address) {
        try {
          setIsLoading(true)
          // Get provider from window.ethereum
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const contractInstance = new ethers.Contract(contractAddress, contractABI, signer)
          setContract(contractInstance)
          
          await fetchSavingsGoals(contractInstance)
        } catch (error) {
          console.error("Error initializing contract:", error)
          toast.error("Failed to connect to blockchain")
        } finally {
          setIsLoading(false)
        }
      }
    }

    initializeContract()
  }, [isConnected, address])

  const fetchSavingsGoals = async (contractInstance: ethers.Contract) => {
    try {
      setIsLoading(true)
      const result = await contractInstance.getSavingsGoals()
      setSavingsGoals(result)
    } catch (error) {
      console.error("Error fetching savings goals:", error)
      toast.error("Failed to fetch savings goals")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGoal({
      ...newGoal,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newGoal.name || !newGoal.current || !newGoal.target) {
      toast.error("Please fill in all required fields")
      return
    }

    if (parseFloat(newGoal.current) > parseFloat(newGoal.target)) {
      toast.error("Current savings cannot exceed target")
      return
    }

    if (!contract) {
      toast.error("Not connected to the blockchain")
      return
    }

    try {
      setIsLoading(true)
      
      // Convert to Wei
      const currentInWei = ethers.parseEther(newGoal.current)
      const targetInWei = ethers.parseEther(newGoal.target)
      
      // Create a signed transaction
      const tx = await contract.addSavingsGoal(
        newGoal.name,
        currentInWei,
        targetInWei
      )

      toast.success("Savings goal submitted to blockchain")
      
      // Wait for the transaction to be mined
      await tx.wait()
      
      // Refresh the goals list
      await fetchSavingsGoals(contract)
      
      // Reset the form
      setNewGoal({
        name: "",
        current: "",
        target: "",
      })

      toast.success("Savings goal added successfully")
    } catch (error) {
      console.error("Error adding savings goal:", error)
      toast.error("Failed to add savings goal")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateGoal = async (index: number, newCurrent: string) => {
    if (!contract) {
      toast.error("Not connected to the blockchain")
      return
    }

    try {
      setIsLoading(true)
      
      const goal = savingsGoals[index]
      const currentInWei = ethers.parseEther(newCurrent)
      
      // Create a signed transaction
      const tx = await contract.updateSavingsGoal(
        index,
        currentInWei,
        goal.target
      )

      toast.success("Updating savings goal...")
      
      // Wait for the transaction to be mined
      await tx.wait()
      
      // Refresh the goals list
      await fetchSavingsGoals(contract)

      toast.success("Savings goal updated successfully")
    } catch (error) {
      console.error("Error updating savings goal:", error)
      toast.error("Failed to update savings goal")
    } finally {
      setIsLoading(false)
    }
  }

  // Format the amount from Wei to ETH and convert to USD (simplified for display)
  const formatAmount = (amount: bigint) => {
    const amountInEth = parseFloat(ethers.formatEther(amount))
    const usdValue = amountInEth * 3000 // Simple conversion for display
    return usdValue.toFixed(2)
  }

  // Calculate percentage completion for a goal
  const calculatePercentage = (current: bigint, target: bigint) => {
    if (target === BigInt(0)) return 0
    return Number((current * BigInt(100)) / target)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Savings Goals</h1>
        <Button
          asChild
          className="bg-sky-700 hover:bg-sky-600 text-sky-100"
        >
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Savings Goal Form */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <CardTitle className="text-sky-300">Add New Savings Goal</CardTitle>
            <CardDescription className="text-sky-400">Set financial targets to work towards</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sky-300">Goal Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newGoal.name}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="e.g., New Car, Vacation, Emergency Fund"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="current" className="text-sky-300">Current Amount</Label>
                <Input
                  id="current"
                  name="current"
                  type="number"
                  step="0.001"
                  value={newGoal.current}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="Current savings (in ETH)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target" className="text-sky-300">Target Amount</Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  step="0.001"
                  value={newGoal.target}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="Target amount (in ETH)"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-sky-700 hover:bg-sky-600 text-sky-100 mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Savings Goal
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Savings Goals List */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sky-300">Your Savings Goals</CardTitle>
                <CardDescription className="text-sky-400">Track your progress towards financial targets</CardDescription>
              </div>
              {contract && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => contract && fetchSavingsGoals(contract)}
                  className="border-sky-700 text-sky-300 hover:bg-sky-900 hover:text-sky-100"
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-sky-400" />
                <p className="text-sky-400">Loading your savings goals...</p>
              </div>
            ) : savingsGoals.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-sky-400">No savings goals found. Add your first goal!</p>
                <PlusCircle className="h-12 w-12 text-sky-500 mx-auto opacity-50" />
              </div>
            ) : (
              <div className="space-y-6">
                {savingsGoals.map((goal, index) => (
                  <div key={index} className="p-4 rounded-lg bg-sky-900">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-sky-300">{goal.name}</h3>
                      <div>
                        <UpdateSavingsForm 
                          index={index} 
                          currentAmount={formatAmount(goal.current)}
                          onUpdate={handleUpdateGoal}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-sky-400">Progress</span>
                      <span className="text-sky-300">
                        {calculatePercentage(goal.current, goal.target)}%
                      </span>
                    </div>

                    <Progress 
                      value={calculatePercentage(goal.current, goal.target)} 
                      className="h-2 mb-3 bg-sky-950"
                    />

                    <div className="flex justify-between text-sm">
                      <span className="text-sky-400">Current</span>
                      <span className="text-sky-300">${formatAmount(goal.current)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-sky-400">Target</span>
                      <span className="text-sky-300">${formatAmount(goal.target)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-sky-400">Remaining</span>
                      <span className="text-sky-300">
                        ${(parseFloat(formatAmount(goal.target)) - parseFloat(formatAmount(goal.current))).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function UpdateSavingsForm({ 
  index, 
  currentAmount, 
  onUpdate, 
  isLoading 
}: { 
  index: number; 
  currentAmount: string; 
  onUpdate: (index: number, newAmount: string) => Promise<void>;
  isLoading: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    
    await onUpdate(index, amount)
    setIsOpen(false)
    setAmount("")
  }

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="border-sky-700 text-sky-300 hover:bg-sky-800 hover:text-sky-100 h-7 text-xs"
      >
        Update Progress
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-8 z-10 mt-1 w-60 rounded-md bg-sky-950 p-4 shadow-lg border border-sky-800">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor={`update-amount-${index}`} className="text-xs text-sky-300">
                New Current Amount (ETH)
              </Label>
              <Input
                id={`update-amount-${index}`}
                type="number"
                step="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 h-8 text-sm bg-sky-900 border-sky-700 text-sky-100"
                placeholder="Enter new amount"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="w-full h-8 text-xs bg-sky-700 hover:bg-sky-600 text-sky-100"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Save"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-8 text-xs border-sky-700 text-sky-300 hover:bg-sky-800"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
