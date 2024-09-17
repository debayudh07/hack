"use client";
import { useState, useEffect } from "react";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}
import { ethers } from "ethers";
import { parseEther } from "ethers";
import axios from "axios";
import { Web3Provider } from "@ethersproject/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
export default function Crypto() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState<string>("");
  

  interface CryptoTrend {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
  }

  const [cryptoTrends, setCryptoTrends] = useState<CryptoTrend[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    { id: number; amount: string; address: string; date: string }[]
  >([
    { id: 1, amount: "0.5 ETH", address: "0x1234...5678", date: "2023-04-01" },
    { id: 2, amount: "1.2 BTC", address: "1BvBM...NJG4", date: "2023-03-28" },
    { id: 3, amount: "100 XRP", address: "rG1QQ...47Uk", date: "2023-03-25" },
  ]);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  // Fetch crypto trends using CoinGecko API
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
            },
          }
        );
        setCryptoTrends(data);
      } catch (error) {
        console.error("Error fetching crypto trends:", error);
      }
    };

    fetchCryptoTrends();
  }, []);

  // Handle sending transaction to Sepolia test network
  const sendTransaction = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");

    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: address,
        value: parseEther(amount),
      });
      console.log("Transaction Hash:", tx.hash);

      // Update recent transactions
      setRecentTransactions((prev) => [
        {
          id: Date.now(),
          amount: `${amount} ETH`,
          address: address.slice(0, 6) + "..." + address.slice(-4),
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
      setAmount("");
      setAddress("");
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTransaction();
  };

  return (
    <div className="min-h-screen bg-black text-sky-400 p-8">
         <Link href="/">Home</Link>
      <h1 className="text-4xl font-bold mb-8 text-center">Crypto Transaction</h1>
      <div className="max-w-md mx-auto">
        {/* MetaMask Connect Button */}
        <Button
          onClick={connectWallet}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white mb-4"
        >
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect to MetaMask"}
        </Button>

        <Card className="bg-gray-900 border-sky-400">
          <CardHeader>
            <CardTitle className="text-sky-400">New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
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
                  className="bg-gray-800 text-sky-400 border-sky-400"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-sky-400">
                  Recipient Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray-800 text-sky-400 border-sky-400"
                  placeholder="0x..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white"
              >
                Send Transaction
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Crypto Trends Card */}
        <Card className="mt-8 bg-gray-900 border-sky-400">
          <CardHeader>
            <CardTitle className="text-sky-400">Current Crypto Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cryptoTrends.map((coin) => (
                <li
                  key={coin.id}
                  className="flex justify-between items-center border-b border-sky-400 pb-2"
                >
                  <span className="text-sm text-white">{coin.name}</span>
                  <span className="text-xs text-white">{coin.symbol.toUpperCase()}</span>
                  <span className="text-xs text-white">${coin.current_price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
