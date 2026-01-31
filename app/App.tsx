import React, { useState, useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { INITIAL_NODES, INITIAL_EDGES, MOCK_CONTRACT } from './constants';
import { NodeData, ChatMessage, AutomationLog } from './types';
import { analyzeClientMessage } from './services/geminiService';
import { saveContent, saveWhatsAppPreview, markWhatsAppAsSent } from './services/storageService';
import { Play, Sparkles, Layout, PenTool, Settings, X, Save, ShieldCheck, BookOpen } from 'lucide-react';

const SettingsModal = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  aiTone,
  setAiTone
}: {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (val: string) => void;
  aiTone: string;
  setAiTone: (val: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-purple/40 backdrop-blur-sm">
      <div className="bg-white border-[3px] border-dark-purple rounded-3xl w-full max-w-md shadow-cartoon overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-pale-purple/50 p-6 border-b-[3px] border-dark-purple flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-dark-purple rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-dark-purple" />
            </div>
            <h2 className="text-xl font-display font-black text-dark-purple uppercase tracking-tight">Settings</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X className="w-6 h-6 text-dark-purple" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-misty-orchid flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your API key here..."
              className="w-full bg-canvas-bg border-2 border-dark-purple rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 ring-misty-orchid/30 transition-all"
            />
            <p className="text-[10px] text-gray-400 font-medium">Your key is stored locally and never shared.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-misty-orchid">AI Assistant Tone</label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="w-full bg-canvas-bg border-2 border-dark-purple rounded-xl px-4 py-3 font-body text-sm focus:outline-none cursor-pointer"
            >
              <option value="Professional & Warm">Professional & Warm</option>
              <option value="Technical & Precise">Technical & Precise</option>
              <option value="Creative & Bold">Creative & Bold</option>
              <option value="Minimalist">Minimalist</option>
            </select>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-dark-purple text-white font-display font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-deep-nebula transition-all shadow-cartoon-sm active:translate-y-1 active:shadow-none"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [logs, setLogs] = useState<AutomationLog[]>([]);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', sender: 'ai', text: "Ready to assist with Villa Serenity.", timestamp: new Date() }
  ]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [currentTab, setCurrentTab] = useState<'canvas' | 'logs'>('canvas');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('user_gemini_api_key') || '');
  const [aiTone, setAiTone] = useState('Professional & Warm');

  useEffect(() => {
    localStorage.setItem('user_gemini_api_key', apiKey);
  }, [apiKey]);

  const addLog = (message: string, type: AutomationLog['type'] = 'info', nodeId: string = '') => {
    setLogs(prev => [{
      id: Math.random().toString(36),
      timestamp: new Date(),
      nodeId,
      message,
      type
    }, ...prev]);
  };

  const simulateNodeExecution = async (nodeId: string, duration = 800) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'processing' } : n));
    await new Promise(r => setTimeout(r, duration));
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'success' } : n));
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'idle' } : n));
    }, 2000);
  };

  const runProjectWorkflow = async () => {
    setIsAiProcessing(true);
    addLog('Starting Workflow...', 'info', '1');
    await simulateNodeExecution('1', 1000);

    // Parallel AI Tasks
    setNodes(prev => prev.map(n => (n.id === '2' || n.id === '3') ? { ...n, status: 'processing' } : n));

    const [emailRes, socialRes] = await Promise.all([
      analyzeClientMessage('email_update', MOCK_CONTRACT),
      analyzeClientMessage('social_caption', MOCK_CONTRACT)
    ]);

    setNodes(prev => prev.map(n => (n.id === '2' || n.id === '3') ? { ...n, status: 'success' } : n));

    // Save generated content
    saveContent({
      id: Date.now().toString(),
      type: 'email',
      content: emailRes.generatedText,
      timestamp: new Date(),
      projectName: 'Villa Serenity',
      metadata: { taskType: 'email_update' }
    });

    saveContent({
      id: (Date.now() + 1).toString(),
      type: 'social',
      content: socialRes.generatedText,
      timestamp: new Date(),
      projectName: 'Villa Serenity',
      metadata: { taskType: 'social_caption' }
    });

    // Display Results in Chat and Logs
    addLog(`Drafted Email`, 'success', '2');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: `Draft Email:\n${emailRes.generatedText}`,
      timestamp: new Date()
    }]);

    addLog(`Generated Caption`, 'success', '3');
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `Social Caption:\n${socialRes.generatedText}`,
      timestamp: new Date()
    }]);

    // Node 4: WhatsApp Preview (fully functional)
    await simulateNodeExecution('4', 800);
    const previewId = Date.now().toString();
    const whatsappPreview = {
      id: previewId,
      recipient: 'Client - Villa Serenity',
      message: emailRes.generatedText,
      timestamp: new Date(),
      sent: false
    };
    saveWhatsAppPreview(whatsappPreview);
    addLog(`WhatsApp preview created and ready to send`, 'success', '4');
    setMessages(prev => [...prev, {
      id: (Date.now() + 2).toString(),
      sender: 'ai',
      text: `📱 WhatsApp Preview Ready:\n\nTo: ${whatsappPreview.recipient}\n\n${whatsappPreview.message}\n\n[Click "SEND_WHATSAPP:${previewId}" to send]`,
      timestamp: new Date(),
      metadata: { whatsappPreviewId: previewId, isClickable: true }
    }]);

    // Node 5: Save to Marketing (fully functional)
    await simulateNodeExecution('5', 800);
    addLog(`Content saved to Marketing Library`, 'success', '5');
    setMessages(prev => [...prev, {
      id: (Date.now() + 3).toString(),
      sender: 'ai',
      text: `✅ Saved to Marketing:\n- Email draft\n- Social caption\n\nBoth items are now in your content library.`,
      timestamp: new Date()
    }]);

    // Node 6: Task Checklist generation
    await simulateNodeExecution('6', 1000);
    const checklistRes = await analyzeClientMessage('task_checklist', MOCK_CONTRACT);
    addLog(`Technical task checklist generated`, 'success', '6');
    setMessages(prev => [...prev, {
      id: (Date.now() + 4).toString(),
      sender: 'ai',
      text: `📋 Architectural Task Checklist:\n\n${checklistRes.generatedText}`,
      timestamp: new Date()
    }]);

    setIsAiProcessing(false);
  };

  const handleUserMessage = async (text: string) => {
    // Handle WhatsApp send action
    if (text.includes('[Click to send]') || text.startsWith('SEND_WHATSAPP:')) {
      const previewId = text.split(':')[1];
      if (previewId) {
        markWhatsAppAsSent(previewId);
        addLog(`WhatsApp message sent successfully`, 'success', '4');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: '✅ WhatsApp message sent! Your client will receive the update shortly.',
          timestamp: new Date()
        }]);
        return;
      }
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    setIsAiProcessing(true);

    const response = await analyzeClientMessage('general_chat', MOCK_CONTRACT, text);

    const replyMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text: response.generatedText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, replyMsg]);
    setIsAiProcessing(false);
  };

  return (
    // Changed: Full screen container, no padding, no rounded corners on main wrapper
    <div className="h-screen w-screen bg-paper flex flex-col overflow-hidden font-body">

      {/* Header Bar - Now flush with top */}
      <div className="h-16 border-b-[3px] border-dark-purple flex items-center justify-between px-6 bg-paper shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-display font-extrabold uppercase tracking-tight text-dark-purple">
            AI ARCHITECT <span className="text-misty-orchid">CENTRE</span>
          </h1>
          <div className="hidden lg:block h-6 w-[2px] bg-dark-purple/20"></div>
          <span className="hidden lg:block text-[10px] font-bold tracking-widest uppercase text-gray-400">Studio OS v2.0</span>
        </div>

        {/* Navigation Pills */}
        <div className="hidden md:flex gap-3">
          <button className="px-4 py-1.5 text-xs rounded-full bg-dark-purple text-paper font-bold border-2 border-dark-purple hover:bg-deep-nebula transition-colors shadow-cartoon-sm hover:translate-y-[2px] hover:shadow-none">
            Workflows
          </button>
          <button className="px-4 py-1.5 text-xs rounded-full bg-pale-purple text-dark-purple font-bold border-2 border-dark-purple hover:bg-misty-orchid/20 transition-colors shadow-cartoon-sm hover:translate-y-[2px] hover:shadow-none">
            Copywriting
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-1.5 text-xs rounded-full bg-misty-orchid text-paper font-bold border-2 border-dark-purple hover:bg-dark-purple transition-colors shadow-cartoon-sm hover:translate-y-[2px] hover:shadow-none">
            Settings
          </button>
          <a
            href="/manual.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-white text-dark-purple font-bold border-2 border-dark-purple hover:bg-pale-purple transition-colors shadow-cartoon-sm hover:translate-y-[2px] hover:shadow-none">
            <BookOpen className="w-3.5 h-3.5" />
            Manual
          </a>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-dark-purple">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-dark-purple"></span>
          online
        </div>
      </div>

      {/* Dashboard Content Grid - Full height */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">

        {/* LEFT: Main Canvas Area */}
        <div className="flex-1 relative border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-dark-purple bg-canvas-bg">
          {/* Canvas Toolbar */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto w-14 h-14 bg-white border-2 border-dark-purple rounded-2xl flex items-center justify-center shadow-cartoon hover:translate-y-1 hover:shadow-cartoon-sm transition-all cursor-pointer">
              <Layout className="w-6 h-6 text-dark-purple" />
            </div>
            <div className="pointer-events-auto w-14 h-14 bg-white border-2 border-dark-purple rounded-2xl flex items-center justify-center shadow-cartoon hover:translate-y-1 hover:shadow-cartoon-sm transition-all cursor-pointer">
              <PenTool className="w-6 h-6 text-dark-purple" />
            </div>
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="pointer-events-auto w-14 h-14 bg-white border-2 border-dark-purple rounded-2xl flex items-center justify-center shadow-cartoon hover:translate-y-1 hover:shadow-cartoon-sm transition-all cursor-pointer">
              <Settings className="w-6 h-6 text-dark-purple" />
            </div>
          </div>

          <Canvas nodes={nodes} edges={edges} setNodes={setNodes} />

          <div className="absolute bottom-6 left-6 bg-white border-2 border-dark-purple rounded-full px-5 py-2.5 text-xs font-bold shadow-cartoon flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-misty-orchid animate-pulse"></div>
            Canvas Active: Project Villa Serenity
          </div>
        </div>

        {/* RIGHT: Widgets Column - Fixed width on desktop */}
        <div className="w-full lg:w-[360px] bg-paper flex flex-col overflow-hidden">

          {/* Widget 1: Control Deck */}
          <div className="p-5 border-b-[3px] border-dark-purple bg-pale-purple/20">
            <div className="bg-white rounded-2xl border-[3px] border-dark-purple p-4 shadow-cartoon relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-dark-purple border-2 border-dark-purple rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <button
                    onClick={runProjectWorkflow}
                    disabled={isAiProcessing}
                    className="w-full h-full rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-80 disabled:cursor-not-allowed group">
                    {isAiProcessing ? <Sparkles className="w-6 h-6 text-pale-purple animate-spin" /> : <Play className="w-6 h-6 text-pale-purple ml-0.5 fill-current group-hover:text-misty-orchid transition-colors" />}
                  </button>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-misty-orchid uppercase tracking-wider mb-0.5">Quick Action</span>
                  <h2 className="text-lg font-display font-black text-dark-purple leading-none mb-0.5">Monthly Update</h2>
                  <span className="text-xs font-medium text-dark-purple/70">Villa Serenity • Phase 2</span>
                </div>
              </div>
              {/* Progress bar fake */}
              <div className="h-3 w-full bg-canvas-bg border-2 border-dark-purple rounded-full overflow-hidden">
                <div className={`h-full bg-misty-orchid transition-all duration-500 ease-out ${isAiProcessing ? 'w-full animate-pulse' : 'w-[2%]'}`}></div>
              </div>
            </div>
          </div>

          {/* Widget 2: Chat & Logs */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="flex border-b-[3px] border-dark-purple">
              <button
                onClick={() => setCurrentTab('canvas')}
                className={`flex-1 py-3 font-bold text-xs uppercase tracking-wide border-r-[3px] border-dark-purple transition-colors ${currentTab === 'canvas' ? 'bg-misty-orchid text-white' : 'hover:bg-gray-50 text-dark-purple'}`}>
                AI Chat
              </button>
              <button
                onClick={() => setCurrentTab('logs')}
                className={`flex-1 py-3 font-bold text-xs uppercase tracking-wide transition-colors ${currentTab === 'logs' ? 'bg-misty-orchid text-white' : 'hover:bg-gray-50 text-dark-purple'}`}>
                System Logs
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
              {currentTab === 'canvas' ? (
                <WhatsAppSimulator
                  messages={messages}
                  onSendMessage={handleUserMessage}
                  isTyping={isAiProcessing}
                />
              ) : (
                <div className="h-full overflow-y-auto p-6 space-y-4 bg-canvas-bg scrollbar-hide">
                  {logs.length === 0 && (
                    <div className="text-center text-gray-400 mt-10 text-sm font-bold">No activity recorded.</div>
                  )}
                  {logs.map(log => (
                    <div key={log.id} className="bg-white border-2 border-dark-purple rounded-xl p-4 shadow-cartoon-sm hover:translate-x-1 transition-transform">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black px-2 py-1 rounded border border-dark-purple uppercase ${log.type === 'success' ? 'bg-green-200' :
                          log.type === 'error' ? 'bg-red-200' :
                            log.type === 'warning' ? 'bg-yellow-200' : 'bg-blue-200'
                          }`}>
                          {log.type}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">{log.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-medium text-dark-purple leading-relaxed font-sans">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Widget Area */}
          <div className="p-4 bg-paper border-t-[3px] border-dark-purple flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Project</span>
              <span className="font-display font-bold text-base text-dark-purple">Villa Serenity</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-dark-purple text-white flex items-center justify-center text-xs font-bold border-2 border-dark-purple shadow-cartoon-sm">
              VS
            </div>
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        aiTone={aiTone}
        setAiTone={setAiTone}
      />
    </div>
  );
}