'use client'

import { useState, useEffect } from "react"
import { ethers } from "ethers"

import { parseEther } from "ethers"
import axios from "axios"
import { Web3Provider } from "@ethersproject/providers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Menu, X, Home, Briefcase, TrendingUp, Settings, User, Network, Clock, Hash, Send } from "lucide-react"
import { motion } from "framer-motion"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface CryptoTrend {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
}

interface AccountInfo {
  address: string
  balance: string
  network: string
  blockNumber: number
  transactionCount: number
}

interface Transaction {
  sender: string;
  amount: number; // or string for high-precision amounts
  description: string;
  timestamp: number; // or Date if you'd like a Date object
}


const CONTRACT_ADDRESS = "0x7C7Ee72A3a9Bc377F89A76f770a906C8A82f1b6c"
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "TransactionLogged",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getMyTransactions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct TransactionLogger.Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserTransactions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct TransactionLogger.Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "logTransaction",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]

export default function Crypto() {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [description, setDescription] = useState("")
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [cryptoTrends, setCryptoTrends] = useState<CryptoTrend[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true)
        const provider = new Web3Provider(window.ethereum)
        const network = await provider.getNetwork()
        const accounts = await provider.send("eth_requestAccounts", [])
        const address = accounts[0]
        const balance = await provider.getBalance(address)
        const blockNumber = await provider.getBlockNumber()
        const transactionCount = await provider.getTransactionCount(address)

        setAccountInfo({
          address,
          balance: ethers.formatEther(balance.toString()),
          network: network.name,
          blockNumber,
          transactionCount,
        })

        const signer = provider.getSigner()
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer as unknown as ethers.ContractRunner)
        setContract(newContract)

        await fetchTransactions(newContract)
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("MetaMask is not installed!")
    }
  }

  const fetchTransactions = async (contractInstance: ethers.Contract) => {
    try {
      const txs = await contractInstance.getMyTransactions()
      setTransactions(txs)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  useEffect(() => {
    const fetchCryptoTrends = async () => {
      try {
        const { data } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h",
            },
          }
        )
        setCryptoTrends(data)
      } catch (error) {
        console.error("Error fetching crypto trends:", error)
      }
    }

    fetchCryptoTrends()
  }, [])

  const logTransaction = async () => {
    if (!contract || !accountInfo) return alert("Please connect to MetaMask first!")

    try {
      setIsLoading(true)
      const tx = await contract.logTransaction(description, { value: parseEther(amount) })
      await tx.wait()
      
      await fetchTransactions(contract)
      
      setAmount("")
      setDescription("")

      const provider = new Web3Provider(window.ethereum)
      const newBalance = await provider.getBalance(accountInfo.address)
      const newTransactionCount = await provider.getTransactionCount(accountInfo.address)
      setAccountInfo(prev => ({
        ...prev!,
        balance: ethers.formatEther(newBalance.toString()),
        transactionCount: newTransactionCount,
      }))
    } catch (error) {
      console.error("Transaction error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    logTransaction()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-sky-400">
      <nav className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sky-400 transition-colors duration-200 hover:text-sky-300">
            CryptoTrade
          </Link>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-sky-400 hover:text-sky-300 transition-colors duration-200"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
          <ul className={`md:flex space-y-2 md:space-y-0 md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:relative top-full left-0 right-0 bg-gray-800 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out`}>
            <li>
              <Link href="/" className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200">
                <Briefcase className="mr-2 h-4 w-4" />
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/trends" className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trends
              </Link>
            </li>
            <li>
              <Link href="/settings" className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-sky-300">Crypto Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : accountInfo ? (
                  <div className="space-y-2">
                    <p className="text-sm text-white flex items-center">
                      <User className="mr-2 h-4 w-4 text-sky-400" />
                      <span className="font-semibold">Address:</span> {accountInfo.address.slice(0, 6)}...{accountInfo.address.slice(-4)}
                    </p>
                    <p className="text-sm text-white flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-sky-400" />
                      <span className="font-semibold">Balance:</span> {accountInfo.balance} ETH
                    </p>
                    <p className="text-sm text-white flex items-center">
                      <Network className="mr-2 h-4 w-4 text-sky-400" />
                      <span className="font-semibold">Network:</span> {accountInfo.network}
                    </p>
                    <p className="text-sm text-white flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-sky-400" />
                      <span className="font-semibold">Latest Block:</span> {accountInfo.blockNumber}
                    </p>
                    <p className="text-sm text-white flex items-center">
                      <Hash className="mr-2 h-4 w-4 text-sky-400" />
                      <span className="font-semibold">Transaction Count:</span> {accountInfo.transactionCount}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={connectWallet}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 transform hover:scale-105"
                  >
                    Connect to MetaMask
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Log Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-sky-400">
                      Amount (ETH)
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-700 text-sky-400 border-sky-400 transition-colors duration-200 focus:border-sky-300"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sky-400">
                      Description
                    </Label>
                    <Input
                      id="description"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-gray-700 text-sky-400 border-sky-400 transition-colors duration-200 focus:border-sky-300"
                      placeholder="Transaction description"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 transform hover:scale-105"
                    disabled={!accountInfo || isLoading}
                  >
                    {isLoading ? "Logging..." : "Log Transaction"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Current Crypto Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {cryptoTrends.map((coin) => (
                    <li
                      key={coin.id}
                      className="flex justify-between items-center border-b border-sky-400 pb-2 transition-colors duration-200 hover:bg-gray-700"
                    >
                      <span className="text-sm text-white">{coin.name}</span>
                      <span className="text-xs text-white">{coin.symbol.toUpperCase()}</span>
                      <span className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${coin.current_price.toFixed(2)} ({coin.price_change_percentage_24h.toFixed(2)}%)
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b border-sky-400 pb-2 transition-colors duration-200 hover:bg-gray-700"
                    >
                      <span className="text-sm text-white">{ethers.formatEther(tx.amount)} ETH</span>
                      <span className="text-xs text-white">{tx.description}</span>
                      <span className="text-xs text-white">{new Date(Number(tx.timestamp) * 1000).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}