import { createContext, useContext, useState } from 'react';
import { useCoordination } from './CoordinationContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { addThread } = useCoordination();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: 'Can you generate a summary of the Q3 sales performance for the enterprise sector, highlighting our top regions?'
    },
    {
      id: 2,
      type: 'agent',
      text: `I'm generating the Q3 sales performance summary for the enterprise sector...

**Key Highlights:**
- Total Revenue: **$24.5M** (+18% YoY)
- Top Performing Region: **EMEA** with 42% of total volume
- New Enterprise Contracts: **142**

I've mapped out the full workflow execution timeline and visualized this data in the panel to your right. Do you want me to proceed with compiling the final PDF report?`
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setIsProcessing(true);

    try {
      const { hrService } = await import('../services/hrService');
      const response = await hrService.askPolicyQuestion(text);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'agent',
        text: response.response || 'No response received from agent.'
      }]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'agent',
        text: 'Error connecting to the AI agent backend. Make sure the backend server is running.'
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isProcessing, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
