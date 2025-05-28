import { useState, useRef, useEffect, useCallback } from 'react';

export default function Mainbox() {
  const [messages, setMessages] = useState([
    {
      text: "Hi, I'm Sukh. How can I support your mind today? 🌿",
      sender: 'ai',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const speakText = (text) => {
    if (!voiceEnabled) return;

    const synth = window.speechSynthesis;
    const strippedText = text.replace(/:[^:\s]+:/g, ''); // Remove emoji codes like :smile:
    const utterance = new SpeechSynthesisUtterance(strippedText);
    utterance.lang = 'en-IN';
    synth.cancel();
    synth.speak(utterance);
  };

  const handleSend = useCallback(async () => {
    if (input.trim() === '') return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const aiResponse = {
        text: data.reply,
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      speakText(data.reply);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Oops! Something went wrong. Please try again later.",
          sender: 'ai',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, voiceEnabled]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.start();
  };

  return (
    <main className="font-poppins flex-1 flex flex-col p-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4 mb-2 px-2 max-w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`
              max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl shadow-md text-sm
              flex flex-col break-words
              ${msg.sender === 'user'
                ? 'self-end bg-blue-600 text-white rounded-br-none animate-slideInRight'
                : 'self-start bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none animate-slideInLeft'}
            `}
          >
            <span>{msg.text}</span>
            <time className="text-xs opacity-70 mt-1 text-gray-700 dark:text-gray-300 self-end">
              {formatTime(msg.timestamp)}
            </time>
          </div>
        ))}

        {isTyping && (
          <div className="self-start bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl px-5 py-3 text-sm shadow-md animate-pulse flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="20" cy="12" r="2" />
            </svg>
            Sukh is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t pt-2 px-2"
      >
        {/* 🎤 Mic Button */}
        <button
          type="button"
          onClick={startListening}
          className={`p-2 rounded-full border transition ${
            isListening ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800'
          } hover:scale-110`}
          title="Tap to speak"
        >
          🎤
        </button>

        {/* Voice Toggle Button */}
        <button
          type="button"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-full border hover:scale-110 transition ${
            voiceEnabled ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-800'
          }`}
          title={voiceEnabled ? 'Disable AI Voice' : 'Enable AI Voice'}
        >
          🔈
        </button>

        <input
          type="text"
          ref={inputRef}
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600
            transition text-black dark:text-white bg-white dark:bg-gray-800"
          placeholder="Type or speak..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          type="submit"
          disabled={input.trim() === ''}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>

      <style jsx>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease forwards;
        }
      `}</style>
    </main>
  );
}
