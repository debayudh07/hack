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
import { PlusCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Budget {
  name: string
  spent: bigint
  budget: bigint
}

export default function BudgetsPage() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [newBudget, setNewBudget] = useState({
    name: "",
    spent: "",
    budget: "",
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
          
          await fetchBudgets(contractInstance)
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

  const fetchBudgets = async (contractInstance: ethers.Contract) => {
    try {
      setIsLoading(true)
      const result = await contractInstance.getBudgets()
      setBudgets(result)
    } catch (error) {
      console.error("Error fetching budgets:", error)
      toast.error("Failed to fetch budgets")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewBudget({
      ...newBudget,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newBudget.name || !newBudget.spent || !newBudget.budget) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!contract) {
      toast.error("Not connected to the blockchain")
      return
    }

    try {
      setIsLoading(true)
      
      const spentAmount = ethers.parseEther(newBudget.spent)
      const budgetAmount = ethers.parseEther(newBudget.budget)

      const tx = await contract.addBudget(
        newBudget.name,
        spentAmount,
        budgetAmount
      )

      toast.success("Budget submitted to blockchain")
      
      // Wait for the transaction to be mined
      await tx.wait()
      
      // Refresh the budgets list
      await fetchBudgets(contract)
      
      // Reset the form
      setNewBudget({
        name: "",
        spent: "",
        budget: "",
      })

      toast.success("Budget added successfully")
    } catch (error) {
      console.error("Error adding budget:", error)
      toast.error("Failed to add budget")
    } finally {
      setIsLoading(false)
    }
  }

  // Format the amount from Wei to Ether
  const formatAmount = (amount: bigint) => {
    return parseFloat(ethers.formatEther(amount)).toFixed(4)
  }

  // Calculate percentage
  const calculatePercentage = (spent: bigint, budget: bigint) => {
    if (budget === BigInt(0)) return 0
    return (Number(spent) / Number(budget)) * 100
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Budget Manager</h1>
        <Button
          asChild
          className="bg-sky-700 hover:bg-sky-600 text-sky-100"
        >
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Budget Form */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <CardTitle className="text-sky-300">Add New Budget</CardTitle>
            <CardDescription className="text-sky-400">Set spending limits for different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sky-300">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newBudget.name}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="e.g., Housing, Food, Transportation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="spent" className="text-sky-300">Already Spent (ETH)</Label>
                <Input
                  id="spent"
                  name="spent"
                  type="number"
                  step="0.0001"
                  value={newBudget.spent}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="0.0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sky-300">Budget Limit (ETH)</Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.0001"
                  value={newBudget.budget}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="0.0"
                  required
                />
              </div>
            
              <Button 
                type="submit" 
                className="w-full bg-sky-700 hover:bg-sky-600 text-sky-100"
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
                    Add Budget
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Budgets List */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sky-300">Budget Overview</CardTitle>
                <CardDescription className="text-sky-400">
                  Your spending vs budget limits
                </CardDescription>
              </div>
              <Button 
                onClick={() => contract && fetchBudgets(contract)} 
                className="bg-sky-700 hover:bg-sky-600 text-sky-100"
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <div className="text-center py-8 text-sky-400">
                {isLoading ? "Loading budgets..." : "No budgets found. Add your first budget category!"}
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget, index) => {
                  const percentage = calculatePercentage(budget.spent, budget.budget)
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-sky-300">{budget.name}</span>
                        <span className="text-sky-400">
                          {formatAmount(budget.spent)} ETH / {formatAmount(budget.budget)} ETH
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-sky-900">
                        <div
                          className={`h-full rounded-full ${percentage > 90 ? 'bg-red-500' : 'bg-sky-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-sky-400 text-right">
                        {percentage.toFixed(1)}% used
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-sky-400 justify-center">
            Budgets are securely stored on the blockchain
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
