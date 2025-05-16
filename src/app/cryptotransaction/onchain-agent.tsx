"use client"

import type React from "react"

import { useState } from "react"
import { ethers } from "ethers"
import { Web3Provider } from "@ethersproject/providers"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Menu, X, Home, TrendingUp, Settings, User, Network, Clock, MessageSquare, Bot, Zap } from "lucide-react"
import { motion } from "framer-motion"

declare global {
  interface Window {
    ethereum?: any
  }
}

interface AccountInfo {
  address: string
  balance: string
  network: string
  blockNumber: number
}

interface Agent {
  id: string
  name: string
  description: string
  capabilities: string[]
  fee: string
}

interface AgentInteraction {
  agentId: string
  agentName: string
  prompt: string
  response: string
  timestamp: number
}

// Sample agents data
const SAMPLE_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "DataAnalyst",
    description: "Analyzes on-chain data and provides insights",
    capabilities: ["Transaction analysis", "Wallet profiling", "Token flow tracking"],
    fee: "0.001",
  },
  {
    id: "agent-2",
    name: "MarketOracle",
    description: "Provides market predictions based on on-chain activity",
    capabilities: ["Price predictions", "Trend analysis", "Whale activity monitoring"],
    fee: "0.002",
  },
  {
    id: "agent-3",
    name: "SecurityGuardian",
    description: "Scans contracts and transactions for security issues",
    capabilities: ["Contract auditing", "Scam detection", "Risk assessment"],
    fee: "0.0015",
  },
]

export default function OnchainAgent() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [prompt, setPrompt] = useState("")
  const [interactions, setInteractions] = useState<AgentInteraction[]>([])
  const [agents] = useState<Agent[]>(SAMPLE_AGENTS)

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

        setAccountInfo({
          address,
          balance: ethers.formatEther(balance.toString()),
          network: network.name,
          blockNumber,
        })
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      alert("MetaMask is not installed!")
    }
  }

  const interactWithAgent = async () => {
    if (!selectedAgent || !accountInfo || !prompt.trim()) return

    setIsLoading(true)

    try {
      // Simulate agent interaction with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a simulated response based on the agent and prompt
      const response = generateAgentResponse(selectedAgent, prompt)

      // Add the interaction to history
      const newInteraction: AgentInteraction = {
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        prompt,
        response,
        timestamp: Date.now(),
      }

      setInteractions((prev) => [newInteraction, ...prev])
      setPrompt("")
    } catch (error) {
      console.error("Agent interaction error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAgentResponse = (agent: Agent, userPrompt: string): string => {
    // This is a simple simulation - in a real app, this would call an API
    const responses = {
      "agent-1": [
        "Based on my analysis of on-chain data, I've detected unusual transaction patterns in the addresses you mentioned.",
        "The wallet you're inquiring about has interacted with 37 different DeFi protocols in the last 30 days.",
        "Transaction volume for this token has increased by 43% in the last 24 hours, suggesting growing interest.",
      ],
      "agent-2": [
        "Market indicators suggest a potential price correction within the next 48 hours based on whale movements.",
        "On-chain metrics indicate accumulation patterns similar to those seen before the last major rally.",
        "Smart money is currently moving into layer-2 solutions, as evidenced by transaction flows.",
      ],
      "agent-3": [
        "I've analyzed the contract you shared and found 2 potential vulnerabilities in the access control mechanism.",
        "This transaction pattern matches known scam behaviors. Exercise caution when interacting with this address.",
        "The contract you're about to interact with has been flagged for suspicious activity by 3 security protocols.",
      ],
    }

    // Select a random response based on agent ID
    const agentResponses = responses[agent.id as keyof typeof responses] || ["I'm processing your request..."]
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    interactWithAgent()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-sky-400">
      <nav className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-sky-400 transition-colors duration-200 hover:text-sky-300">
            OnchainAgents
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
          <ul
            className={`md:flex space-y-2 md:space-y-0 md:space-x-4 ${isMenuOpen ? "block" : "hidden"} md:block absolute md:relative top-full left-0 right-0 bg-gray-800 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out`}
          >
            <li>
              <Link
                href="/"
                className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/agents"
                className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200"
              >
                <Bot className="mr-2 h-4 w-4" />
                Agents
              </Link>
            </li>
            <li>
              <Link
                href="/trends"
                className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Trends
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center py-2 md:py-0 text-sky-400 hover:text-sky-300 transition-colors duration-200"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-sky-300">Onchain Agent Interaction</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                      <span className="font-semibold">Address:</span> {accountInfo.address.slice(0, 6)}...
                      {accountInfo.address.slice(-4)}
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
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Available Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className={`cursor-pointer p-4 rounded-lg border ${
                        selectedAgent?.id === agent.id
                          ? "border-sky-400 bg-sky-900/20"
                          : "border-gray-700 hover:border-sky-400/50"
                      } transition-all duration-200`}
                    >
                      <h3 className="text-lg font-semibold text-sky-300 flex items-center">
                        <Bot className="mr-2 h-4 w-4" />
                        {agent.name}
                      </h3>
                      <p className="text-xs text-white mt-1">{agent.description}</p>
                      <div className="mt-2">
                        <p className="text-xs text-sky-400 font-semibold">Capabilities:</p>
                        <ul className="text-xs text-white mt-1">
                          {agent.capabilities.map((cap, idx) => (
                            <li key={idx} className="flex items-start">
                              <Zap className="mr-1 h-3 w-3 text-sky-400 mt-0.5" />
                              {cap}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs text-white mt-2">
                        <span className="font-semibold">Fee:</span> {agent.fee} ETH
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 lg:col-span-3"
          >
            <Card className="bg-gray-800 border-sky-400 shadow-lg shadow-sky-400/10 transition-all duration-300 hover:shadow-sky-400/20 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-600 to-sky-400 text-white">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Agent Interaction
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedAgent ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Bot className="h-5 w-5 text-sky-400" />
                      <span>
                        Interacting with <span className="font-bold text-sky-300">{selectedAgent.name}</span>
                      </span>
                    </div>

                    <div>
                      <Label htmlFor="prompt" className="text-sky-400">
                        Your Query
                      </Label>
                      <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="bg-gray-700 text-sky-400 border-sky-400 transition-colors duration-200 focus:border-sky-300 min-h-[100px]"
                        placeholder="Enter your query for the agent..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200 transform hover:scale-105"
                      disabled={!accountInfo || isLoading || !prompt.trim()}
                    >
                      {isLoading ? "Processing..." : "Send Query"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center text-white p-6">
                    <Bot className="h-12 w-12 text-sky-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Agent Selected</h3>
                    <p className="text-gray-400">Please select an agent from the list above to begin interaction.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {interactions.length > 0 && (
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
                    Interaction History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {interactions.map((interaction, index) => (
                      <div key={index} className="border border-sky-400/30 rounded-lg p-4 bg-gray-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Bot className="h-4 w-4 text-sky-400 mr-2" />
                            <span className="text-sky-300 font-semibold">{interaction.agentName}</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(interaction.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="mb-2 pl-6 text-sm text-gray-300">
                          <p className="text-xs text-gray-400 mb-1">Your query:</p>
                          <p>{interaction.prompt}</p>
                        </div>

                        <div className="pl-6 text-sm text-white">
                          <p className="text-xs text-sky-400 mb-1">Agent response:</p>
                          <p>{interaction.response}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
