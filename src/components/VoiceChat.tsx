import React, { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

interface VoiceChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceChat({ isOpen, onClose }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  const processInput = useMutation(api.tasks.processUserInput);

  const startListening = () => {
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
      toast.info('I\'m listening... Tell me what\'s on your mind');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
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

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processTranscript = async () => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      await processInput({ input: transcript.trim() });
      setTranscript('');
      toast.success('Your thoughts have been organized!');
      onClose();
    } catch (error) {
      toast.error('Failed to process your thoughts. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-semibold">Talk It Out</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share what's on your mind. I'll listen and help organize your thoughts.
          </p>

          {transcript && (
            <div className="bg-secondary p-3 rounded-md">
              <p className="text-sm font-mono">{transcript}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex-1 py-3 rounded-md font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isListening ? '⏹️ Stop Listening' : '🎤 Start Talking'}
            </button>

            {transcript && (
              <button
                onClick={processTranscript}
                disabled={isProcessing}
                className="px-4 py-3 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? '⏳' : '✨ Organize'}
              </button>
            )}
          </div>

          <button
            onClick={() => setTranscript('')}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Clear transcript
          </button>
        </div>
      </div>
    </div>
  );
}
