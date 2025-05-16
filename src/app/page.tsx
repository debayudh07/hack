"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, CreditCard, PieChart, TrendingUp, Menu, X } from "lucide-react"
import Link from "next/link"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"
import { FlipWords } from "@/components/ui/flip-words"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    signup: false
  })

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Check if sections are in viewport
      const heroSection = document.getElementById('hero-section')
      const featuresSection = document.getElementById('features-section')
      const signupSection = document.getElementById('signup-section')
      
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect()
        setIsVisible(prev => ({ ...prev, hero: rect.top < window.innerHeight && rect.bottom >= 0 }))
      }
      
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect()
        setIsVisible(prev => ({ ...prev, features: rect.top < window.innerHeight && rect.bottom >= 0 }))
      }
      
      if (signupSection) {
        const rect = signupSection.getBoundingClientRect()
        setIsVisible(prev => ({ ...prev, signup: rect.top < window.innerHeight && rect.bottom >= 0 }))
      }
    }

    handleScroll() // Check visibility on initial load
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }
  
  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }
  
  const navbarVariants = {
    transparent: { backgroundColor: "rgba(0, 0, 0, 0)" },
    solid: { backgroundColor: "rgba(17, 24, 39, 0.95)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black to-gray-900 text-sky-200">
      {/* Navbar */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 h-20 flex items-center justify-between backdrop-blur-sm"
        initial="transparent"
        animate={isScrolled ? "solid" : "transparent"}
        variants={navbarVariants}
        transition={{ duration: 0.3 }}
      >
        <Link className="flex items-center justify-center group" href="#">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7 }}
          >
            <BrainCircuit className="h-8 w-8 text-sky-300" />
          </motion.div>
          <motion.span 
            className="ml-2 text-2xl font-bold text-sky-200"
            whileHover={{ color: "#7dd3fc" }}
            transition={{ duration: 0.2 }}
          >AIax</motion.span>
        </Link>
        
        <nav className="hidden md:flex gap-8">
          {["Portfolio", "Dashboard", "AI based savings", "Crypto Transaction"].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                className="text-base md:text-lg font-medium relative overflow-hidden group"
                href={`/${item.toLowerCase().replace(/\s+/g, '')}`}
              >
                <span className="relative z-10">{item}</span>
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="scale-110"
          >
            <ConnectButton />
          </motion.div>
        </nav>
        
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-sky-200 hover:text-sky-300" 
            onClick={toggleMenu}
          >
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </motion.div>
      </motion.header>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-md pt-16"
          >
            <div className="flex flex-col h-full p-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="self-end text-sky-200 hover:text-sky-300"
                onClick={toggleMenu}
              >
                <X />
                <span className="sr-only">Close menu</span>
              </Button>
              
              <motion.nav 
                className="flex flex-col items-center justify-center flex-1 gap-8 mt-8"
                variants={staggerChildren}
                initial="hidden"
                animate="visible"
              >
                {["Portfolio", "Dashboard", "AI based savings", "Crypto Transaction"].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeIn}
                    whileHover={{ scale: 1.1, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link 
                      className="text-xl font-medium hover:text-sky-300 transition-colors"
                      href={`/${item.toLowerCase().replace(/\s+/g, '')}`}
                      onClick={toggleMenu}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  variants={fadeIn}
                  className="mt-8"
                >
                  <ConnectButton />
                </motion.div>
              </motion.nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          id="hero-section"
          className="w-full min-h-screen flex items-center justify-center pt-16 pb-24 px-4"
        >
          <motion.div
            className="container max-w-5xl"
            initial="hidden"
            animate={isVisible.hero ? "visible" : "hidden"}
            variants={staggerChildren}
          >
            <div className="flex flex-col items-center space-y-8 text-center">
              <motion.div
                className="space-y-4"
                variants={fadeIn}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                  className="mb-6"
                >
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-sky-100">
                    <TextHoverEffect
                      text="AIAX"
                      duration={8}
                    />
                  </h1>
                </motion.div>
                
                <motion.p 
                  className="mx-auto max-w-[700px] text-lg sm:text-xl text-sky-300 leading-relaxed"
                  variants={fadeIn}
                >
                  Take control of your finances with our cutting-edge AI technology. Smart expense tracking,
                  personalized insights, and automated savings.
                </motion.p>
              </motion.div>
              
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-sky-500 text-black hover:bg-sky-400 transition-colors text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-sky-500/20"
                >
                  Get Started
                </Button>
              </motion.div>
              
              <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sky-400 text-sm">Scroll to discover</p>
                  <div className="w-8 h-12 border-2 border-sky-400 rounded-full flex justify-center pt-2">
                    <motion.div 
                      className="w-2 h-2 bg-sky-400 rounded-full"
                      animate={{ y: [0, 14, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section 
          id="features-section"
          className="w-full py-20 md:py-32 bg-gray-900/70 backdrop-blur-sm"
        >
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <motion.div
              className="mb-16 text-center"
              initial="hidden"
              animate={isVisible.features ? "visible" : "hidden"}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-sky-100 mb-4">
                Key{" "}
                <FlipWords
                  words={['aspects', 'powers', 'features']}
                  duration={3000}
                  className="text-sky-100"
                />
              </h2>
              <div className="w-24 h-1 bg-sky-400 mx-auto rounded-full mt-4"></div>
            </motion.div>
            
            <motion.div 
              className="grid gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-3"
              initial="hidden"
              animate={isVisible.features ? "visible" : "hidden"}
              variants={staggerChildren}
            >
              {[
                {
                  icon: <CreditCard className="h-12 w-12 mb-6 text-sky-400" />,
                  title: "Smart Expense Tracking",
                  description: "Automatically categorize and track your expenses with AI precision, saving you hours of manual input and organization."
                },
                {
                  icon: <PieChart className="h-12 w-12 mb-6 text-sky-400" />,
                  title: "Personalized Insights",
                  description: "Get tailored financial advice based on your spending patterns, helping you make smarter decisions with your money."
                },
                {
                  icon: <TrendingUp className="h-12 w-12 mb-6 text-sky-400" />,
                  title: "Automated Savings",
                  description: "Let AI optimize your savings with smart allocation strategies that maximize growth and minimize risk."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl"
                >
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-sky-200">{feature.title}</h3>
                  <p className="text-sky-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Signup Section */}
        <section 
          id="signup-section"
          className="w-full py-24 md:py-32 relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: "radial-gradient(circle at center, rgba(56, 189, 248, 0.3) 0%, transparent 70%)",
              backgroundSize: "100% 100%",
            }}
          />
          
          <div className="container px-4 md:px-6 max-w-4xl mx-auto relative z-10">
            <motion.div 
              className="flex flex-col items-center justify-center space-y-8 text-center"
              initial="hidden"
              animate={isVisible.signup ? "visible" : "hidden"}
              variants={staggerChildren}
            >
              <motion.div 
                className="space-y-4"
                variants={fadeIn}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-sky-100">Start Your Financial Journey</h2>
                <p className="max-w-[600px] text-sky-300 md:text-xl/relaxed">
                  Join thousands of users who have transformed their financial lives with our AI-powered platform.
                </p>
              </motion.div>
              
              <motion.div 
                className="w-full max-w-md space-y-4"
                variants={fadeIn}
              >
                <form className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    className="flex-1 bg-gray-800/80 border-gray-700 text-sky-200 placeholder-sky-400 h-12 rounded-xl"
                    placeholder="Enter your email" 
                    type="email" 
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      type="submit" 
                      className="bg-sky-500 text-black hover:bg-sky-400 transition-colors font-medium text-base h-12 px-6 rounded-xl shadow-lg shadow-sky-500/20"
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </form>
                <p className="text-xs text-sky-400 mt-2">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2 hover:text-sky-300 transition-colors" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </motion.div>
              
              <motion.div 
                className="mt-12 pt-8 border-t border-gray-800/50 w-full"
                variants={fadeIn}
              >
                <div className="flex flex-col gap-4 items-center">
                  <p className="text-sky-300 text-lg font-medium">Used and trusted by</p>
                  <div className="flex flex-wrap justify-center gap-8 opacity-70">
                    {["Company A", "Company B", "Company C", "Company D"].map((company, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -3 }}
                        className="text-sky-200 font-semibold"
                      >
                        {company}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-10 w-full px-4 md:px-6 border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <BrainCircuit className="h-5 w-5 text-sky-400 mr-2" />
                <span className="font-bold text-sky-200">AIax</span>
              </div>
              <p className="text-sm text-sky-400">Revolutionizing personal finance with AI technology.</p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Testimonials", "FAQ"]
              },
              {
                title: "Company",
                links: ["About", "Team", "Careers", "Press"]
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Security", "Cookies"]
              }
            ].map((column, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-semibold text-sky-200">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <Link className="text-xs text-sky-400 hover:text-sky-300 transition-colors" href="#">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800/50">
            <p className="text-xs text-sky-400">© 2023 AIax Finance. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {["Twitter", "LinkedIn", "Instagram", "GitHub"].map((social, i) => (
                <Link key={i} className="text-xs hover:text-sky-300 transition-colors" href="#">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}