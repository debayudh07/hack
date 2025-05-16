"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ethers } from "ethers"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  PiggyBank,
  RefreshCw,
  Search,
  Wallet,
} from "lucide-react"

import { contractAddress, contractABI } from "@/contract/contracts"
import { toast } from "sonner"
import { cn } from "@/lib/utils"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAccount, useBalance, useDisconnect, useEnsName } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function PersonalFinanceDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)
  const [savingsRate, setSavingsRate] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const savings = monthlyIncome - monthlyExpenses
    const calculatedSavingsRate = (savings / monthlyIncome) * 100
    setSavingsRate(parseFloat(calculatedSavingsRate.toFixed(2)))
    setTotalBalance(savings)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-sky-300">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:gap-8 lg:p-8">
        <FinancialOverview
          isLoaded={isLoaded}
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          savingsRate={savingsRate}
        />
        <FinancialDetails isLoaded={isLoaded} />
      </main>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-sky-950 text-sky-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-sky-300 text-xl sm:text-2xl">Welcome to Your Financial Dashboard</DialogTitle>
            <DialogDescription className="text-sky-400 text-sm sm:text-base">
              Please enter your monthly income and expenses to get started.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDialogSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="monthlyIncome" className="text-right text-sky-300 text-sm sm:text-base">
                  Monthly Income
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  className="col-span-3 bg-sky-900 text-sky-100"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="monthlyExpenses" className="text-right text-sky-300 text-sm sm:text-base">
                  Monthly Expenses
                </Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  className="col-span-3 bg-sky-900 text-sky-100"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-sky-700 text-sky-100 hover:bg-sky-600 w-full sm:w-auto">
                Calculate and Start
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 flex h-14 sm:h-16 items-center gap-4 border-b border-sky-800 bg-black px-4 md:px-6"
    >
      <NavBar />
      <MobileNav />
      <SearchAndUserNav />
    </motion.header>
  )
}

function NavBar() {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        href="#"
        className="flex items-center gap-2 text-base font-semibold md:text-lg"
      >
        <Wallet className="h-5 w-5 md:h-6 md:w-6" />
        <span className="sr-only">FinanceTrack</span>
      </Link>
      <Link
        href="/"
        className="text-sky-300 transition-colors hover:text-sky-100"
      >
        Home
      </Link>      <Link
        href="#"
        className="text-sky-500 transition-colors hover:text-sky-300"
      >
        Accounts
      </Link>      <Link
        href="/transactions"
        className="text-sky-500 transition-colors hover:text-sky-300"
      >
        Transactions
      </Link>
      <Link
        href="/budgets"
        className="text-sky-500 transition-colors hover:text-sky-300"
      >
        Budgets
      </Link>      <Link
        href="/savings"
        className="text-sky-500 transition-colors hover:text-sky-300"
      >
        Goals
      </Link>
    </nav>
  )
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 border-sky-700 bg-black text-sky-300 hover:bg-sky-950 hover:text-sky-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black text-sky-300 w-[250px] sm:w-[300px]">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Wallet className="h-6 w-6" />
            <span>FinanceTrack</span>
          </Link>
          <Link href="/" className="hover:text-sky-100">
            Home
          </Link>          <Link
            href="#"
            className="text-sky-500 hover:text-sky-300"
          >
            Accounts
          </Link>
          <Link
            href="/transactions"
            className="text-sky-500 hover:text-sky-300"
          >
            Transactions
          </Link>
          <Link
            href="#"
            className="text-sky-500 hover:text-sky-300"
          >
            Budgets
          </Link>
          <Link
            href="#"
            className="text-sky-500 hover:text-sky-300"
          >
            Goals
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function SearchAndUserNav() {
  // Get wallet state using wagmi hooks
  const { address, isConnected, chain } = useAccount()
  const { data: balanceData } = useBalance({ address })
  const { data: ensName } = useEnsName({ address })
  const { disconnect } = useDisconnect()

  // Truncate wallet address for display
  const truncatedAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : ''

  return (
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <form className="ml-auto flex-1 sm:flex-initial">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sky-500" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="bg-sky-950 pl-8 text-sky-100 placeholder:text-sky-500 w-full sm:w-[200px] md:w-[250px] lg:w-[300px]"
          />
        </div>
      </form>
      
      {!isConnected ? (
        <ConnectButton 
          chainStatus="icon" 
          showBalance={false}
          accountStatus="address"
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full bg-sky-800 text-sky-100 hover:bg-sky-700">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black text-sky-300 w-[280px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <div className="px-2 py-3 border-b border-sky-800">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-sky-500" />
                <span className="text-sm text-sky-400">Wallet</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="text-sky-100 font-bold text-lg">
                  {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.0000 ETH'}
                </div>
                <div className="text-xs text-sky-400 flex items-center gap-1">
                  <span className="bg-sky-900 px-1.5 py-0.5 rounded text-sky-300">
                    {chain?.name || 'Ethereum'}
                  </span>
                  <span className="font-mono">{ensName || truncatedAddress}</span>
                  <button 
                    onClick={() => address && navigator.clipboard.writeText(address)}
                    className="text-sky-500 hover:text-sky-300 p-0.5"
                    title="Copy address"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-sky-950 hover:text-sky-100 mt-1">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-sky-950 hover:text-sky-100">Settings</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-sky-950 hover:text-sky-100">Notifications</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sky-800" />
            <DropdownMenuItem 
              className="hover:bg-sky-950 hover:text-sky-100"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

function FinancialOverview({ isLoaded, totalBalance, monthlyIncome, monthlyExpenses, savingsRate }: { isLoaded: boolean; totalBalance: number; monthlyIncome: number; monthlyExpenses: number; savingsRate: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <FinanceCard
        title="Total Balance"
        value={`$${totalBalance.toFixed(2)}`}
        change="Calculated from your input"
        icon={<DollarSign className="h-4 w-4 text-sky-500" />}
      />
      <FinanceCard
        title="Monthly Income"
        value={`$${monthlyIncome.toFixed(2)}`}
        change="Your reported income"
        icon={<Activity className="h-4 w-4 text-sky-500" />}
      />
      <FinanceCard
        title="Monthly Expenses"
        value={`$${monthlyExpenses.toFixed(2)}`}
        change="Your reported expenses"
        icon={<CreditCard className="h-4 w-4 text-sky-500" />}
      />
      <FinanceCard
        title="Savings Rate"
        value={`${savingsRate.toFixed(2)}%`}
        change="Percentage of income saved"
        icon={<PiggyBank className="h-4 w-4 text-sky-500" />}
      />
    </motion.div>
  )
}

function FinanceCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <Card className="bg-sky-950 text-sky-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-sky-300">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p className="text-xs text-sky-400">{change}</p>
      </CardContent>
    </Card>
  )
}

function FinancialDetails({ isLoaded }: { isLoaded: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-2 xl:grid-cols-3"
    >
      <RecentTransactions />
      <BudgetOverview />
      <SavingsGoals />
    </motion.div>
  )
}

function RecentTransactions() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<{
    description: string
    category: string
    date: number
    amount: bigint
    isIncome: boolean
  }[]>([])
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
    <div>
      <Card className="col-span-2 xl:col-span-2 bg-sky-950 text-sky-100">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="text-sky-300">Recent Transactions</CardTitle>
            <CardDescription className="text-sky-400">Your latest financial activities.</CardDescription>
          </div>
          <Button
            asChild
            size="sm"
            className="ml-auto gap-1 bg-sky-700 text-sky-100 hover:bg-sky-600"
          >
            <Link href="/transactions">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-sky-400">
              {isLoading ? "Loading transactions..." : "No transactions found. Add your first one on the Transactions page!"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-sky-800">
                  <TableHead className="text-sky-300">Description</TableHead>
                  <TableHead className="hidden md:table-cell text-sky-300">Category</TableHead>
                  <TableHead className="hidden xl:table-cell text-sky-300">Date</TableHead>
                  <TableHead className="text-right text-sky-300">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((tx, index) => (
                  <TableRow key={index} className="border-sky-800">
                    <TableCell className="text-sky-100">{tx.description}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-sky-700 text-sky-300">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-sky-400">
                      {formatDate(tx.date)}
                    </TableCell>
                    <TableCell className={`text-right ${tx.isIncome ? 'text-green-400' : 'text-red-400'}`}>
                      {formatAmount(tx.amount, tx.isIncome)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface Transaction {
  description: string;
  category: string;
  date: number;
  amount: bigint;
  isIncome: boolean;
}

function BudgetOverview() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [budgets, setBudgets] = useState<{
    name: string
    spent: bigint
    budget: bigint
  }[]>([])
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
    <Card className="bg-sky-950 text-sky-100">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle className="text-sky-300 text-lg sm:text-xl">Budget Overview</CardTitle>
          <CardDescription className="text-sky-400 text-sm">Your spending vs budget this month</CardDescription>
        </div>
        {contract && (
          <Button
            size="sm"
            onClick={() => contract && fetchBudgets(contract)}
            className="ml-auto bg-sky-700 hover:bg-sky-600 text-sky-100"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-sky-400">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-8 text-sky-400">
            No budgets found. <Link href="/budgets" className="text-sky-300 underline">Create your first budget</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.slice(0, 5).map((budget, index) => {
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
            {budgets.length > 5 && (
              <div className="text-center mt-4">
                <Link href="/budgets" className="text-sky-300 text-sm underline">
                  View all {budgets.length} budgets
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function BudgetCategory({ name, spent, budget }: { name: string; spent: number; budget: number }) {
  const percentage = (spent / budget) * 100
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-sky-300">{name}</span>
        <span className="text-sky-400">
          ${spent} / ${budget}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-sky-900">
        <div
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}





function SavingsGoals() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [savingsGoals, setSavingsGoals] = useState<{
    name: string
    current: bigint
    target: bigint
  }[]>([])
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

  // Format the amount from Wei to USD (assuming 1 ETH = $3000 for display purposes)
  const formatAmount = (amount: bigint) => {
    const amountInEth = parseFloat(ethers.formatEther(amount))
    const usdValue = amountInEth * 3000 // Simple conversion for display
    return usdValue.toFixed(2)
  }

  return (
    <Card className="bg-sky-950 text-sky-100">
      <CardHeader className="flex flex-row items-center">
        <div>
          <CardTitle className="text-sky-300 text-lg sm:text-xl">Savings Goals</CardTitle>
          <CardDescription className="text-sky-400 text-sm">Track your progress towards financial goals</CardDescription>
        </div>
        {contract && (
          <Button
            size="sm"
            onClick={() => contract && fetchSavingsGoals(contract)}
            className="ml-auto bg-sky-700 hover:bg-sky-600 text-sky-100"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8">
        {isLoading ? (
          <div className="text-center py-8 text-sky-400">Loading savings goals...</div>
        ) : savingsGoals.length === 0 ? (
          <div className="text-center py-8 text-sky-400">No savings goals found. Add your first goal!</div>
        ) : (
          savingsGoals.map((goal, index) => (
            <SavingsGoal 
              key={index} 
              name={goal.name} 
              current={parseFloat(formatAmount(goal.current))} 
              target={parseFloat(formatAmount(goal.target))} 
            />
          ))
        )}      </CardContent>
    </Card>
  )
}

function SavingsGoal({ name, current, target }: { name: string; current: number; target: number }) {
  const percentage = (current / target) * 100
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium text-sky-300">{name}</span>
        <span className="text-sm text-sky-400">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-sky-900">
        <div
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-sm text-sky-400">{percentage.toFixed(1)}% complete</div>
    </div>
  )
}