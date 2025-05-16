"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useAccount } from "wagmi"
import Link from "next/link"
import { contractAddress, contractABI } from "@/contract/contracts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Transaction {
  description: string
  category: string
  date: number
  amount: bigint
  isIncome: boolean
}

export default function TransactionsPage() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    category: "",
    date: new Date(), // Today's date
    amount: "",
    isIncome: false,
  })
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  // Categories for the dropdown
  const categories = [
    "Food", "Transportation", "Housing", "Entertainment", 
    "Utilities", "Healthcare", "Education", "Shopping", 
    "Travel", "Salary", "Investment", "Other"
  ]

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
          
          await fetchTransactions(contractInstance)
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

  const fetchTransactions = async (contractInstance: ethers.Contract) => {
    try {
      setIsLoading(true)
      const result = await contractInstance.getTransactions()
      setTransactions(result)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast.error("Failed to fetch transactions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    })
  }
  const handleCategoryChange = (value: string) => {
    setNewTransaction({
      ...newTransaction,
      category: value,
    })
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTransaction({
      ...newTransaction,
      isIncome: e.target.checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newTransaction.description || !newTransaction.category || !newTransaction.amount) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!contract) {
      toast.error("Not connected to the blockchain")
      return
    }

    try {
      setIsLoading(true)
      const amountInWei = parseFloat(newTransaction.amount)
      const unixTimestamp = Math.floor(newTransaction.date.getTime() / 1000)
      
      // Create a signed transaction
      let amount = ethers.parseEther(newTransaction.amount)
      // If it's an expense, make it negative by multiplying by -1
      if (!newTransaction.isIncome) {
        amount = -amount
      }

      const tx = await contract.addTransaction(
        newTransaction.description,
        newTransaction.category,
        unixTimestamp,
        amount
      )

      toast.success("Transaction submitted to blockchain")
      
      // Wait for the transaction to be mined
      await tx.wait()
      
      // Refresh the transactions list
      await fetchTransactions(contract)
      
      // Reset the form
      setNewTransaction({
        description: "",
        category: "",
        date: new Date(),
        amount: "",
        isIncome: false,
      })

      toast.success("Transaction added successfully")
    } catch (error) {
      console.error("Error adding transaction:", error)
      toast.error("Failed to add transaction")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  // Format the amount from Wei to Ether and display + or - prefix
  const formatAmount = (amount: bigint, isIncome: boolean) => {
    const amountInEth = ethers.formatEther(amount)
    const prefix = isIncome ? '+' : '-'
    return `${prefix}${Math.abs(parseFloat(amountInEth)).toFixed(4)} ETH`
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Transactions Manager</h1>
        <Button
          asChild
          className="bg-sky-700 hover:bg-sky-600 text-sky-100"
        >
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Add Transaction Form */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <CardTitle className="text-sky-300">Add New Transaction</CardTitle>
            <CardDescription className="text-sky-400">Record your income or expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sky-300">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newTransaction.description}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="What was this transaction for?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sky-300">Category</Label>
                <Select
                  value={newTransaction.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="bg-sky-900 border-sky-700 text-sky-100">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-sky-900 border-sky-700 text-sky-100">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-sky-100 hover:bg-sky-800">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <div className="space-y-2">
                <Label htmlFor="date" className="text-sky-300">Date</Label>
                <div className="text-center py-2 px-3 bg-sky-900 border border-sky-700 rounded-md text-sky-100">
                  {new Date().toLocaleDateString()} (Today)
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sky-300">Amount (ETH)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.0001"
                  value={newTransaction.amount}
                  onChange={handleInputChange}
                  className="bg-sky-900 border-sky-700 text-sky-100"
                  placeholder="0.0"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isIncome"
                  checked={newTransaction.isIncome}
                  onChange={handleIncomeChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="isIncome" className="text-sky-300">This is income</Label>
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
                    Add Transaction
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Transactions List */}
        <Card className="bg-sky-950 text-sky-100">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sky-300">Transaction History</CardTitle>
                <CardDescription className="text-sky-400">
                  Your recent financial activities
                </CardDescription>
              </div>
              <Button 
                onClick={() => contract && fetchTransactions(contract)} 
                className="bg-sky-700 hover:bg-sky-600 text-sky-100"
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-sky-400">
                {isLoading ? "Loading transactions..." : "No transactions found. Add your first one!"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-sky-800">
                      <TableHead className="text-sky-300">Description</TableHead>
                      <TableHead className="text-sky-300">Category</TableHead>
                      <TableHead className="text-sky-300">Date</TableHead>
                      <TableHead className="text-right text-sky-300">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx, index) => (
                      <TableRow key={index} className="border-sky-800">
                        <TableCell className="text-sky-100">{tx.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-sky-700 text-sky-300">
                            {tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sky-400">
                          {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className={`text-right ${tx.isIncome ? 'text-green-400' : 'text-red-400'}`}>
                          {formatAmount(tx.amount, tx.isIncome)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-sky-400 justify-center">
            Transactions are securely stored on the blockchain
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
