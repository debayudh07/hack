import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is available from the environment
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('API Key is missing in environment variables.');
}

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(apiKey);

// Define the generation model configuration
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

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

// Financial context to provide better responses
const financialContext = `
You are SavingsAI, a helpful financial advisor embedded in a savings planning application. 
Your role is to provide personalized, actionable financial advice.
Keep responses concise (2-3 paragraphs maximum) and friendly.
Focus on practical savings tips, budgeting strategies, and financial wellness.
Avoid generic advice - give specific, actionable recommendations when possible.
Format important points with bullet points for better readability.
`;

// Define the async function to send a message and get a response from the model
export const sendMessage = async (message: string, financialData?: { 
  income?: string | number, 
  expenses?: string | number,
  savings?: string | number 
}): Promise<string> => {
  try {
    // Check if the message contains a question about the creator of the website
    const creatorKeywords = [
      "who's the creator",
      'who created',
      'creator of the website',
      'made this website',
      'developed this',
      'built this'
    ];
    const lowerCaseMessage = message.toLowerCase();
    
    for (const keyword of creatorKeywords) {
      if (lowerCaseMessage.includes(keyword)) {
        return 'The creator of this website is my maestro Debayudh.';
      }
    }
    
    // Create context-aware prompt if financial data is provided
    let enhancedMessage = message;
    if (financialData) {
      const { income, expenses, savings } = financialData;
      if (income && expenses) {
        enhancedMessage = `
          User financial context:
          - Monthly income: $${income}
          - Monthly expenses: $${expenses}
          - Available for savings: $${savings || (Number(income) - Number(expenses)).toFixed(2)}
          
          User question: ${message}
          
          Provide personalized financial advice based on this data.
        `;
      }
    }

    // Create a chat with system context but WITHOUT including it in the history
    const chatSession = model.startChat({
      generationConfig,
    });

    // First send the system message to set context
    await chatSession.sendMessage(`System instruction (use this to guide your responses): ${financialContext}`);

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