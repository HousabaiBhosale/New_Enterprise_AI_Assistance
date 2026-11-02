import { createContext, useContext, useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function getDefaultRoleChatConfig(role, userName) {
  const r = (role || 'admin').toLowerCase();
  const name = userName || 'there';

  if (r === 'employee') {
    return {
      activeAgent: 'Employee Self-Service AI',
      placeholder: 'Ask about your leave balance, company policies, or submit a request...',
      samplePrompts: [
        "I want to apply for leave",
        "Apply leave for 2 days",
        "Check my leave balance",
        "What is our company remote work policy?",
        "How many annual leaves do we get?",
        "What is the status of helpdesk ticket #1?"
      ],
      initialMessage: `Hello **${name}**! I am your personal **Employee Self-Service AI Assistant**.\n\nI can assist you with your day-to-day workplace needs:\n- 🌴 **Leave & Time Off**: Check your current leave balance and submit step-by-step leave applications.\n- 📋 **Company Policies**: Instant answers on workplace policies, benefits, remote work rules, and code of conduct.\n- 🎧 **IT Helpdesk**: Check status of your helpdesk tickets or submit assistance requests.\n\nHow can I help you today?`,
      workflowSteps: [
        { name: "Employee Assistant Ready", status: "completed", detail: "Self-service scope initialized" },
        { name: "Policy Knowledge Active", status: "completed", detail: "Connected to employee handbook & personal leave records" }
      ]
    };
  }

  if (r === 'hr') {
    return {
      activeAgent: 'HR Sentinel Agent',
      placeholder: 'Query employee balances, organizational policies, or process leave requests...',
      samplePrompts: [
        "I want to apply for leave",
        "Apply leave for 2 days",
        "Check leave balance for employee 1",
        "Apply for 5 days of medical leave for employee 1",
        "What is our sick leave and medical certificate policy?",
        "Generate a PDF leave report for employee 2"
      ],
      initialMessage: `Hello **${name}**! I am your **Enterprise HR & People Agent**.\n\nI can help you manage workforce operations:\n- 👥 **Personnel Records**: Inspect employee leave balances and attendance data.\n- 📝 **Leave Applications**: Review, process, and auto-authorize employee leave requests.\n- 📜 **Policy Guidance**: Query official organizational HR guidelines, compliance standards, and benefits.\n- 📊 **Workforce Reporting**: Compile attendance statements and workforce census reports.\n\nHow can I assist your HR workflow today?`,
      workflowSteps: [
        { name: "HR Sentinel Initialized", status: "completed", detail: "LangGraph HR ReAct agent online" },
        { name: "HR Policy Vector Index", status: "completed", detail: "Loaded organizational policies & employee database" }
      ]
    };
  }

  if (r === 'sales') {
    return {
      activeAgent: 'Sales & Revenue Copilot',
      placeholder: 'Ask about sales revenue, customer orders, deals, or pricing playbooks...',
      samplePrompts: [
        "What is our total completed sales revenue?",
        "What discount can we offer for orders over 100 units?",
        "I want to place a new sales order",
        "What is our average deal size and order count?",
        "Generate a PDF sales performance report"
      ],
      initialMessage: `Hello **${name}**! I am your **Enterprise Sales & Commercial AI Copilot**.\n\nI can assist with your pipeline and revenue targets:\n- 💰 **Revenue Analytics**: Real-time sales calculations, completed transactions, and deal metrics.\n- 📈 **Orders & Leads**: Inspect customer order histories, product sales, and transaction logs.\n- 📘 **Sales Playbook**: Consult enterprise discount thresholds, pricing tiers, and contract terms.\n- 📑 **Financial Reports**: Compile executive revenue reports and order summaries.\n\nWhat deal or commercial metric can I analyze for you?`,
      workflowSteps: [
        { name: "Sales Copilot Initialized", status: "completed", detail: "LangGraph Sales ReAct workflow ready" },
        { name: "Sales Playbook RAG", status: "completed", detail: "Connected to pricing tiers & order database" }
      ]
    };
  }

  if (r === 'support' || r === 'staff') {
    return {
      activeAgent: 'Helpdesk & Support Sentinel',
      placeholder: 'Look up helpdesk status, incident triage, or search support SOPs...',
      samplePrompts: [
        "What is the status and priority of helpdesk ticket #1?",
        "I want to create a new helpdesk request",
        "What are our official SLA response times for Critical helpdesk requests?",
        "What is our refund and cancellation policy according to SOP?",
        "Generate a customer helpdesk triage report"
      ],
      initialMessage: `Hello **${name}**! I am your **Enterprise Helpdesk & Support Agent**.\n\nI am configured for helpdesk operations and incident resolution:\n- 🎫 **Helpdesk Status**: Look up helpdesk ticket priorities, incident descriptions, and resolution states.\n- ⚡ **Incident Triage**: Classify issues, escalate priority tickets, and update resolution notes.\n- 📖 **Support SOPs**: Search SLA timelines, troubleshooting workflows, and refund policies.\n- 📄 **Resolution Reports**: Generate formal customer incident resolution statements.\n\nWhich customer helpdesk request or SOP would you like to review?`,
      workflowSteps: [
        { name: "Helpdesk Sentinel Online", status: "completed", detail: "LangGraph Support ReAct workflow ready" },
        { name: "Helpdesk SOP Vector Index", status: "completed", detail: "Loaded customer incident ledger & triage guides" }
      ]
    };
  }

  // System Admin (Full Multi-Agent Supervisor)
  return {
    activeAgent: 'LangGraph Supervisor (Global)',
    placeholder: 'Coordinate queries across HR, Sales, and Helpdesk agents...',
    samplePrompts: [
      "I want to apply for leave",
      "Apply leave for 2 days",
      "Check leave balance for employee 1",
      "What is our company remote work policy?",
      "Calculate our total sales revenue and deal win rate",
      "What is the status and priority of helpdesk ticket #1?",
      "Generate an executive sales performance report"
    ],
    initialMessage: `Hello **${name}**! I am your **Agentic Enterprise AI Supervisor**.\n\nAs a **System Administrator**, you have unrestricted access across all enterprise departments:\n- 👥 **HR & People**: Leave balance checks, policy compliance, workforce statements, and step-by-step leave applications.\n- 📈 **Sales & Revenue**: Financial metrics, order management, pricing playbooks, and revenue reports.\n- 🎧 **Helpdesk**: Helpdesk ticket status, request creation, SOP guidance, and manager escalations.\n- 🔒 **Governance**: Full audit trail inspection and Human-in-the-Loop authorization oversight.\n\nHow can I coordinate your enterprise workflows today?`,
    workflowSteps: [
      { name: "System Ready", status: "completed", detail: "Multi-agent graph initialized with Supervisor node" },
      { name: "Qdrant Vector Store", status: "completed", detail: "Indexed policy, sales playbook, and support SOPs" }
    ]
  };
}

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const initialConfig = getDefaultRoleChatConfig(user?.role, user?.name);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'agent',
      text: initialConfig.initialMessage
    }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState(initialConfig.activeAgent);
  const [workflowSteps, setWorkflowSteps] = useState(initialConfig.workflowSteps);
  const [inputPlaceholder, setInputPlaceholder] = useState(initialConfig.placeholder);
  const [samplePrompts, setSamplePrompts] = useState(initialConfig.samplePrompts || []);

  // When user role or profile changes, re-tailor the assistant session
  useEffect(() => {
    const config = getDefaultRoleChatConfig(user?.role, user?.name);
    setMessages([
      {
        id: 1,
        type: 'agent',
        text: config.initialMessage
      }
    ]);
    setActiveAgent(config.activeAgent);
    setWorkflowSteps(config.workflowSteps);
    setInputPlaceholder(config.placeholder);
    setSamplePrompts(config.samplePrompts || []);
  }, [user?.role, user?.name]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setIsProcessing(true);

    try {
      const history = messages.slice(-8);
      const userRole = user?.role || 'admin';
      const userId = user?.id || 1;
      const response = await chatService.sendQuery(text, userId, history, userRole);
      
      if (response.agent_used) {
        setActiveAgent(response.agent_used);
      }
      if (response.steps && response.steps.length > 0) {
        setWorkflowSteps(response.steps);
      }

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
        text: `⚠️ **Agent Error**: Could not complete request (${error.message || 'Server offline'}). Please ensure the Python backend is running at http://localhost:8000.`
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isProcessing, activeAgent, workflowSteps, inputPlaceholder, samplePrompts, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
