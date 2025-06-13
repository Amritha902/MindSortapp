import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { TaskBoard } from './TaskBoard';
import { ThemeToggle } from './ThemeToggle';
import { CalmMode } from './CalmMode';
import { VoiceChat } from './VoiceChat';
import { LifeModules } from './LifeModules';
import { SummaryAI } from './SummaryAI';
import { toast } from 'sonner';

export function MindSortApp() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [calmModeActive, setCalmModeActive] = useState(false);
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);
  const [lifeModulesOpen, setLifeModulesOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const processInput = useMutation(api.tasks.processUserInput);
  const tasks = useQuery(api.tasks.getUserTasks) || [];

  // Auto-activate calm mode when distress is detected
  useEffect(() => {
    if (lastResult?.distressDetected && !calmModeActive) {
      setCalmModeActive(true);
      setTimeout(() => setCalmModeActive(false), 30000); // Auto-dismiss after 30 seconds
    }
  }, [lastResult?.distressDetected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await processInput({ input: input.trim() });
      setLastResult(result);
      setInput('');
      
      if (result.distressDetected && result.mentalHealthSuggestions?.length > 0) {
        toast.success('Tasks organized! 💙', {
          description: result.mentalHealthSuggestions[0],
          duration: 5000,
        });
      } else {
        toast.success(`Organized ${result.tasks.length} tasks!`);
      }
    } catch (error) {
      toast.error('Failed to process input. Please try again.');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak your thoughts');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setInput(prev => prev + ' ' + finalTranscript);
      }
    };

    recognition.onerror = () => {
      toast.error('Voice input error. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      <CalmMode isActive={calmModeActive} onToggle={() => setCalmModeActive(!calmModeActive)} />
      
      <div className={`space-y-6 transition-all duration-1000 ${calmModeActive ? 'filter brightness-90 contrast-75' : ''}`}>
        {/* Header with controls */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-mono font-bold">Transform Your Thoughts</h1>
            <p className="text-sm text-muted-foreground">
              Share what's on your mind, and I'll organize it for you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSummaryOpen(true)}
              className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              title="AI Summary & Reflection"
            >
              📊
            </button>
            <button
              onClick={() => setLifeModulesOpen(true)}
              className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              title="Life Modules"
            >
              🏠
            </button>
            <button
              onClick={() => setVoiceChatOpen(true)}
              className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              title="Talk It Out Mode"
            >
              💬
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or speak your thoughts... 
                
Example: 'Surgery on 21st, need periods before 17th, sick, haven't finished RISC-V, Java pending, text office at 3 AM, CNVD confusing, feeling overwhelmed...'"
                className="w-full h-32 p-4 bg-background border border-border rounded-md resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
                disabled={isProcessing}
              />
              {input && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {input.length} characters
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Organize My Thoughts'
                )}
              </button>
              
              <button
                type="button"
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {isListening ? '⏹️ Stop' : '🎤 Voice'}
              </button>
            </div>
          </form>

          {/* Mental Health Suggestions */}
          {lastResult?.distressDetected && lastResult?.mentalHealthSuggestions && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                💙 Gentle Reminders
              </h3>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                {lastResult.mentalHealthSuggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Task Board */}
        <TaskBoard tasks={tasks} />
      </div>

      {/* Modals */}
      <VoiceChat isOpen={voiceChatOpen} onClose={() => setVoiceChatOpen(false)} />
      <LifeModules isOpen={lifeModulesOpen} onClose={() => setLifeModulesOpen(false)} />
      <SummaryAI isOpen={summaryOpen} onClose={() => setSummaryOpen(false)} />
    </>
  );
}
