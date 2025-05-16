import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is available from the environment
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the Google Generative AI with the API key
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Define the generation model configuration
const getModel = () => {
  if (!genAI) {
    throw new Error('API Key is missing in environment variables.');
  }
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });
};

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 2048,
  responseMimeType: 'text/plain',
};

// Define TypeScript interface for the response
interface MessageResponse {
  response: {
    text(): string;
  };
}

// Crypto context to provide better responses
const cryptoContext = `
You are CryptoAdvisor, a helpful cryptocurrency and blockchain technology expert embedded in a Web3 portfolio application.
Your role is to provide accurate, personalized advice and information about cryptocurrencies, blockchain technology, DeFi, NFTs, and related topics.

Keep responses concise (2-3 paragraphs maximum) and easy to understand.
Focus on practical advice about cryptocurrency investments, staking, yield farming, and security.
When appropriate, mention specific protocols, networks, or platforms that are relevant to the user's question.
Provide balanced views that include both opportunities and risks.
Format important points with bullet points for better readability.
If the user is new to crypto, explain concepts in simple terms.
Never provide financial advice that suggests specific investment amounts or promises returns.
Be honest about limitations of your knowledge, especially regarding very recent protocol changes or market events.

Remember that users may have different levels of crypto knowledge, so adjust your language accordingly.
`;

// Define the async function to send a message and get a response from the model
export const sendCryptoMessage = async (message: string, financialData?: { 
  walletAddress?: string,
  networkName?: string,
  nativeBalance?: string,
  tokens?: Array<{symbol: string, balance: string}>,
}): Promise<string> => {
  try {
    // If API key is not available, return a fallback response
    if (!apiKey) {
      console.warn('AI API key not found, using fallback responses');
      return getFallbackResponse(message);
    }
    
    // Create context-aware prompt if financial data is provided
    let enhancedMessage = message;
    if (financialData) {
      const { walletAddress, networkName, nativeBalance, tokens } = financialData;
      
      enhancedMessage = `
        User's crypto context:
        - Wallet: ${walletAddress}
        - Network: ${networkName}
        - Balance: ${nativeBalance}
        ${tokens ? `- Tokens: ${tokens.map(t => `${t.symbol} (${t.balance})`).join(', ')}` : ''}
        
        User question: ${message}
        
        Provide personalized crypto advice based on this data.
      `;
    }

    // Create a chat with system context but WITHOUT including it in the history
    const model = getModel();
    const chatSession = model.startChat({
      generationConfig,
    });

    // First send the system message to set context
    await chatSession.sendMessage(`System instruction (use this to guide your responses): ${cryptoContext}`);

    // Then send the user's message to get response
    const result: MessageResponse = await chatSession.sendMessage(enhancedMessage);
    const response = result.response.text();
    
    // Format the response for better readability
    return formatResponse(response);
  } catch (error) {
    console.error('Error sending message to AI:', error);
    return 'Sorry, I encountered an issue processing your request. Please try again later.';
  }
};

// Helper function to format the AI response
const formatResponse = (text: string): string => {
  // Convert plain text bullets to HTML bullet points
  let formatted = text.replace(/^\s*-\s*(.+)$/gm, '• $1');
  
  // Add paragraph breaks
  formatted = formatted.replace(/\n\n/g, '\n\n');
  
  return formatted;
};

// Fallback responses when API key is not available
const getFallbackResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('stake') || lowerMessage.includes('staking')) {
    return "Staking is a way to earn passive income with your crypto. You lock up tokens to support network operations and security in return for rewards. Different networks offer varying APYs, typically 3-20% depending on the protocol. Popular staking options include Ethereum (ETH), Cardano (ADA), Solana (SOL), and Polkadot (DOT).";
  } 
  else if (lowerMessage.includes('defi') || lowerMessage.includes('decentralized finance')) {
    return "DeFi offers financial services without centralized intermediaries using smart contracts. Key activities include lending/borrowing, yield farming, liquidity provision, and flash loans. Popular platforms include Aave, Compound, Uniswap, and Curve Finance. DeFi can offer higher yields than traditional finance but comes with risks like smart contract vulnerabilities and market volatility.";
  }
  else if (lowerMessage.includes('nft') || lowerMessage.includes('non-fungible')) {
    return "NFTs are unique digital assets verified on a blockchain. Unlike cryptocurrencies, each NFT has distinct value and cannot be exchanged equivalently. They're used for digital art, collectibles, gaming items, and more. Popular NFT marketplaces include OpenSea, Rarible, and Foundation.";
  }
  else if (lowerMessage.includes('yield farm') || lowerMessage.includes('farming')) {
    return "Yield farming involves providing liquidity to DeFi protocols to earn rewards, often as governance tokens. It can be profitable but risky due to smart contract vulnerabilities, impermanent loss, and token price volatility. Popular platforms include Curve Finance, Convex, and Yearn Finance.";
  }
  else if (lowerMessage.includes('gas') || lowerMessage.includes('fee')) {
    return "Gas fees are payments made by users to compensate for the computing energy required to process transactions on blockchain networks. These fees fluctuate based on network congestion and transaction complexity. Layer 2 solutions like Optimism and Arbitrum offer lower fees by processing transactions off the main Ethereum chain.";
  }
  else {
    return "I'd be happy to help with your crypto questions! Please ask about specific topics like staking, DeFi protocols, NFTs, market analysis, or trading strategies, and I'll provide detailed information tailored to your needs.";
  }
};