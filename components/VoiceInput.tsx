'use client';

import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onTranscriptComplete: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptComplete }) => {
  const [isClient, setIsClient] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleToggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleDone = () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      onTranscriptComplete(transcript);
      resetTranscript();
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Transcript Preview */}
      {(transcript || listening) && (
        <div className="w-full animate-fade-in p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center min-h-[100px] flex items-center justify-center">
          <p className="text-xl md:text-2xl font-serif text-slate-800 leading-relaxed italic">
            {transcript || (listening ? "Clara is listening..." : "") }
          </p>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Pulsing Mic Button */}
        <button
          onClick={handleToggleListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90 ${
            listening 
              ? 'bg-amber-500 text-white animate-pulse shadow-amber-200 ring-4 ring-amber-100' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="w-10 h-10"
          >
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0z" />
            <path d="M12 18a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z" />
          </svg>
        </button>

        {/* Send Button */}
        <button
          onClick={handleDone}
          disabled={!transcript.trim()}
          className={`h-16 px-10 rounded-2xl text-lg font-bold transition-all flex items-center gap-2 ${
            transcript.trim() 
              ? 'bg-slate-900 text-white shadow-lg hover:bg-slate-800' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>

      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
        {listening ? "Clara is listening" : "Tap the microphone to speak"}
      </p>
    </div>
  );
};

export default VoiceInput;
