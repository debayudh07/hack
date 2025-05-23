'use client'

import { useState, useEffect, useRef } from 'react'
import { useAccount, useBalance, useToken } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AnimatePresence } from 'framer-motion'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ResponsiveLine,
} from '@nivo/line'
import Link from "next/link"
import { sendCryptoMessage } from '@/lib/cryptoAI'
import { 
  Menu, 
  X, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Activity, 
  BarChart3, 
  Settings,
  Wallet,
  Send,
  Bot,
  MessageSquare,
  Loader2,
  MinusCircle,
  MaximizeIcon,
  MinimizeIcon
} from "lucide-react"

// Interface for chat messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Portfolio() {  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [portfolioHistory, setPortfolioHistory] = useState<{ id: string; color: string; data: { x: string; y: number; }[] }[]>([])
  
  // AI chat related states
  const [aiMessage, setAiMessage] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! I\'m your crypto portfolio assistant. Ask me anything about your portfolio, tokens, or crypto in general.' }
  ])
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isAiMinimized, setIsAiMinimized] = useState(false)
  
  // References
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Wagmi hooks
  const { address, isConnected, chain } = useAccount()
  
  const { data: balance } = useBalance({
    address: address
  })

  // Example tokens to fetch (could be dynamically loaded)
  const tokenAddresses = {
    ethereum: {
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
      WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
      LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA' as `0x${string}`,
    }
  }

  // Get token data for major holdings
  const { data: usdcData } = useToken({
    address: isConnected && chain?.id === 1 ? tokenAddresses.ethereum.USDC : undefined,
  })
  
  const { data: wethData } = useToken({
    address: isConnected && chain?.id === 1 ? tokenAddresses.ethereum.WETH : undefined,
  })
  
  const { data: linkData } = useToken({
    address: isConnected && chain?.id === 1 ? tokenAddresses.ethereum.LINK : undefined,
  })

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  // Generate mock historical data (in real app, fetch from API)
  useEffect(() => {
    const generateHistoricalData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentMonth = new Date().getMonth()
      
      const data = []
      let value = Math.random() * 1000 + 500
      
      for (let i = 0; i < 12; i++) {
        let monthIndex = (currentMonth - 11 + i) % 12
        if (monthIndex < 0) monthIndex += 12
        
        // Simulate market fluctuations
        value = value * (0.95 + Math.random() * 0.15)
        
        data.push({
          x: months[monthIndex],
          y: Number(value.toFixed(2))
        })
      }
      
      return [{
        id: "Portfolio Value",
        color: "hsl(217, 91%, 60%)",
        data: data
      }]
    }

    setPortfolioHistory(generateHistoricalData())

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsMenuOpen(true)
      else setIsMenuOpen(false)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // Toggle AI chat window
  const toggleAiChat = () => {
    setIsAiOpen(!isAiOpen)
    setIsAiMinimized(false)
  }

  // Toggle minimize/maximize AI chat window
  const toggleMinimize = () => {
    setIsAiMinimized(!isAiMinimized)
  }

  const handleSendMessage = async () => {
    if (!aiMessage.trim()) return
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: aiMessage }
    setChatHistory(prev => [...prev, userMessage])
    setAiMessage('')
    setIsAiLoading(true)
    
    try {
      // Prepare financial data for context-aware responses
      const financialData = isConnected ? {
        walletAddress: address,
        networkName: chain?.name,
        nativeBalance: balance ? `${balance.formatted} ${balance.symbol}` : undefined,
        tokens: [
          ...(usdcData?.symbol ? [{ symbol: usdcData.symbol, balance: '250.00' }] : []),
          ...(wethData?.symbol ? [{ symbol: wethData.symbol, balance: '1.5000' }] : []),
          ...(linkData?.symbol ? [{ symbol: linkData.symbol, balance: '25.0000' }] : [])
        ]
      } : undefined
      
      // Send message to AI service
      const response = await sendCryptoMessage(aiMessage, financialData)
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error getting AI response:', error)
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an issue. Please try again later.' 
      }])
    } finally {
      setIsAiLoading(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    if (!isConnected || !balance) return '0.00'
    // This would be expanded to include all assets
    return parseFloat(balance.formatted).toFixed(4)
  }

  // Calculate monthly growth (mock data for now)
  const calculateMonthlyGrowth = () => {
    // In a real app, this would calculate based on historical data
    const growthValue = (Math.random() * 10 - 2).toFixed(2)
    return {
      value: growthValue,
      isPositive: parseFloat(growthValue) > 0
    }
  }

  const monthlyGrowth = calculateMonthlyGrowth()

  return (
    <div className="min-h-screen bg-gray-950 text-blue-400">
      <nav className="bg-gray-900 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-300 transition-colors duration-200 hover:text-blue-400">
            FinPortfolio
          </Link>
          
          {isMobile && (
            <button 
              onClick={toggleMenu} 
              className="text-blue-300 hover:text-blue-400 transition-colors duration-200 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          )}
          
          <div className="hidden md:block">
            <ConnectButton showBalance={false} />
          </div>
          
          <div className={`md:flex space-y-2 md:space-y-0 md:space-x-4 ${isMenuOpen || !isMobile ? 'block' : 'hidden'} absolute md:relative top-full left-0 right-0 bg-gray-900 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out z-20`}>
            <ul className="md:flex space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <li>
                <Link href="/" className="flex items-center py-2 md:py-0 text-blue-300 hover:text-blue-400 transition-colors duration-200">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Wallet</span>
                </Link>
              </li>
              <li>
                <Link href="/investments" className="flex items-center py-2 md:py-0 text-blue-300 hover:text-blue-400 transition-colors duration-200">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <span>Investments</span>
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="flex items-center py-2 md:py-0 text-blue-300 hover:text-blue-400 transition-colors duration-200">
                  <Activity className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center py-2 md:py-0 text-blue-300 hover:text-blue-400 transition-colors duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
            <div className="md:hidden">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <div className="mb-8">
              <Wallet size={64} className="mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold text-blue-300 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-blue-500 mb-6">Connect your wallet to view your portfolio</p>
              <ConnectButton />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-300 mb-2">
                Welcome {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
              </h1>
              <p className="text-blue-500">Your Web3 Financial Portfolio</p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Card 1: Total Portfolio Value */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-blue-700 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center">
                      <Wallet className="mr-2 h-5 w-5" />
                      Total Portfolio Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end">
                      <p className="text-4xl font-bold text-blue-400">
                        {balance ? `${calculatePortfolioValue()} ${balance.symbol}` : "Connecting..."}
                      </p>
                      <span className="text-blue-500 ml-2 mb-1">
                        {chain && `on ${chain.name}`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card 2: Monthly Growth */}
              <div>
                <Card className="bg-gray-900 border-blue-700 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Monthly Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${monthlyGrowth.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {monthlyGrowth.isPositive ? '+' : ''}{monthlyGrowth.value}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Card 3: Network Info */}
              <div>
                <Card className="bg-gray-900 border-blue-700 h-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      {chain ? (
                        <>
                          <div className={`w-3 h-3 rounded-full mr-2 bg-green-500`}></div>
                          <p className="text-blue-300">{chain.name}</p>
                        </>
                      ) : (
                        <>
                          <div className={`w-3 h-3 rounded-full mr-2 bg-yellow-500`}></div>
                          <p className="text-blue-300">Not Connected</p>
                        </>
                      )}
                    </div>
                    {chain && (
                      <p className="text-sm text-blue-500 mt-1">Chain ID: {chain.id}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {/* Portfolio Performance Chart */}
              <div>
                <Card className="bg-gray-900 border-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Portfolio Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveLine
                        data={portfolioHistory}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                          type: 'linear',
                          min: 'auto',
                          max: 'auto',
                          stacked: true,
                          reverse: false
                        }}
                        yFormat=" >-$"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Month',
                          legendOffset: 36,
                          legendPosition: 'middle'
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Value',
                          legendOffset: -40,
                          legendPosition: 'middle'
                        }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}                        enableArea={true}
                        areaOpacity={0.1}
                        curve="natural"
                        legends={[
                          {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                              {
                                on: 'hover',
                                style: {
                                  itemBackground: 'rgba(0, 0, 0, .03)',
                                  itemOpacity: 1
                                }
                              }
                            ]
                          }
                        ]}
                        theme={{
                          axis: {
                            domain: {
                              line: {
                                stroke: '#60A5FA'
                              }
                            },
                            legend: {
                              text: {
                                fill: '#60A5FA'
                              }
                            },
                            ticks: {
                              line: {
                                stroke: '#60A5FA',
                                strokeWidth: 1
                              },
                              text: {
                                fill: '#60A5FA'
                              }
                            }
                          },
                          legends: {
                            text: {
                              fill: '#60A5FA'
                            }
                          },
                          tooltip: {
                            container: {
                              background: '#1F2937',
                              color: '#60A5FA'
                            }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Token Balances Grid */}
            <div>
              <Card className="bg-gray-900 border-blue-700 mb-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Token Holdings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Native Token */}
                    <div className="bg-gray-800 p-4 rounded-md border border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-semibold">
                          {balance ? balance.symbol : 'ETH'}
                        </span>
                        <div className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                          Native
                        </div>
                      </div>
                      <div className="text-xl text-blue-300 font-bold mb-1">
                        {balance ? balance.formatted : '0.0000'}
                      </div>
                      <div className="text-sm text-blue-500">
                        {/* In real app, fetch price data from API */}
                        ${balance ? (parseFloat(balance.formatted) * 2000).toFixed(2) : '0.00'}
                      </div>
                    </div>
                    
                    {/* USDC Token */}
                    <div className="bg-gray-800 p-4 rounded-md border border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-semibold">
                          {usdcData ? usdcData.symbol : 'USDC'}
                        </span>
                        <div className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                          ERC-20
                        </div>
                      </div>
                      <div className="text-xl text-blue-300 font-bold mb-1">
                        {usdcData ? '250.00' : '0.00'}
                      </div>
                      <div className="text-sm text-blue-500">
                        $250.00
                      </div>
                      {usdcData && (
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          {tokenAddresses.ethereum.USDC}
                        </div>
                      )}
                    </div>
                    
                    {/* WETH Token */}
                    <div className="bg-gray-800 p-4 rounded-md border border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-semibold">
                          {wethData ? wethData.symbol : 'WETH'}
                        </span>
                        <div className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                          ERC-20
                        </div>
                      </div>
                      <div className="text-xl text-blue-300 font-bold mb-1">
                        {wethData ? '1.5000' : '0.0000'}
                      </div>
                      <div className="text-sm text-blue-500">
                        $3,000.00
                      </div>
                      {wethData && (
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          {tokenAddresses.ethereum.WETH}
                        </div>
                      )}
                    </div>

                    {/* LINK Token - Adding this using existing linkData hook */}
                    <div className="bg-gray-800 p-4 rounded-md border border-blue-800">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-semibold">
                          {linkData ? linkData.symbol : 'LINK'}
                        </span>
                        <div className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
                          ERC-20
                        </div>
                      </div>
                      <div className="text-xl text-blue-300 font-bold mb-1">
                        {linkData ? '25.0000' : '0.0000'}
                      </div>
                      <div className="text-sm text-blue-500">
                        $175.00
                      </div>
                      {linkData && (
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          {tokenAddresses.ethereum.LINK}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <div>
              <Card className="bg-gray-900 border-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-700/20">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'Swap', token: 'ETH → USDC', amount: '0.5 ETH', time: '2 hours ago', status: 'Completed' },
                      { type: 'Receive', token: 'ETH', amount: '1.2 ETH', time: '1 day ago', status: 'Completed' },
                      { type: 'Send', token: 'USDC', amount: '100 USDC', time: '3 days ago', status: 'Completed' },
                    ].map((tx, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center transition-all duration-300 hover:bg-gray-800 p-3 rounded"
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-10 rounded-full mr-3 ${
                            tx.type === 'Receive' ? 'bg-green-500' : 
                            tx.type === 'Send' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="text-blue-300 font-medium">{tx.type}</div>
                            <div className="text-sm text-blue-500">{tx.token}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-300">{tx.amount}</div>
                          <div className="text-xs text-blue-500">{tx.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* AI Chat Toggle Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={toggleAiChat}
        aria-label="Chat with AI Assistant"
      >
        <Bot size={24} />
      </button>

      {/* AI Chat Window */}
      {isAiOpen && (
        <div
          className="fixed bottom-20 right-6 w-80 md:w-96 bg-gray-900 rounded-lg border border-blue-700 shadow-xl z-50 flex flex-col overflow-hidden"
          style={{ height: isAiMinimized ? 60 : 500 }}
        >
          {/* AI Chat Header */}
          <div className="bg-gray-800 p-3 flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="text-blue-400 mr-2" size={20} />
              <h3 className="text-blue-300 font-medium">Crypto Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMinimize} 
                className="text-blue-400 hover:text-blue-300 transition-colors"
                aria-label={isAiMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isAiMinimized ? <MaximizeIcon size={18} /> : <MinimizeIcon size={18} />}
              </button>
              <button 
                onClick={toggleAiChat} 
                className="text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* AI Chat Messages */}
          {!isAiMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
                {chatHistory.map((message, index) => (
                  <div 
                    key={index}
                    className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div 
                      className={`inline-block max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-gray-800 text-blue-300 rounded-tl-none'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isAiLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block max-w-[80%] p-3 rounded-lg bg-gray-800 text-blue-300 rounded-tl-none">
                      <Loader2 className="animate-spin h-4 w-4 mr-2 inline" />
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* AI Chat Input */}
              <div className="p-3 border-t border-blue-900 bg-gray-800">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Ask about your portfolio or crypto..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    className="flex-1 bg-gray-700 border-blue-700 text-blue-200 placeholder:text-blue-500"
                  />
                  <Button 
                    type="submit" 
                    disabled={isAiLoading || !aiMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isAiLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={18} />}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
