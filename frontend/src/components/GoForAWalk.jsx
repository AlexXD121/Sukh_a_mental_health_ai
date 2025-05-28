import { useState, useEffect, useRef, useCallback } from "react";

const tips = [
  "Walk briskly to boost your heart health.",
  "Keep a steady pace and breathe deeply.",
  "Walking outdoors improves mood and creativity.",
  "Try walking in nature for extra relaxation.",
  "Use your walk time to clear your mind.",
  "Good posture while walking helps prevent aches.",
  "Walk for at least 30 minutes daily for health benefits.",
  "Walking with a friend can make it more enjoyable.",
  "Remember to stretch gently before and after your walk.",
];

export default function GoForAWalk({ darkMode }) {
  // State variables
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipFading, setTipFading] = useState(false);

  const tipTimeoutRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("totalWalkSeconds");
    if (stored) {
      setTotalSeconds(parseInt(stored, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("totalWalkSeconds", totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (!running && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, seconds]);

  useEffect(() => {
    if (!running && seconds !== 0) {
      setTotalSeconds((prev) => prev + seconds);
      setSeconds(0);
    }
  }, [running, seconds]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const nextTip = useCallback(() => {
    if (tipTimeoutRef.current) return;
    setTipFading(true);
    tipTimeoutRef.current = setTimeout(() => {
      let next = Math.floor(Math.random() * tips.length);
      while (next === tipIndex) {
        next = Math.floor(Math.random() * tips.length);
      }
      setTipIndex(next);
      setTipFading(false);
      tipTimeoutRef.current = null;
    }, 300);
  }, [tipIndex]);

  const resetTracking = useCallback(() => {
    setSeconds(0);
    setTotalSeconds(0);
    setRunning(false);
    localStorage.removeItem("totalWalkSeconds");
  }, []);

  const bgCard = darkMode ? "bg-gray-900" : "bg-white";
  const textMain = darkMode ? "text-purple-200" : "text-purple-900";
  const shadowCard = darkMode
    ? "shadow-[0_8px_24px_rgba(99,102,241,0.4)]"
    : "shadow-[0_8px_24px_rgba(139,92,246,0.3)]";

  const buttonBase =
    "px-6 py-2 rounded-full font-semibold transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md";

  const buttonStart = darkMode
    ? "bg-indigo-700 text-indigo-100 hover:bg-indigo-600 hover:scale-105"
    : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105";

  const buttonStop = darkMode
    ? "bg-red-600 text-red-200 hover:bg-red-500 hover:scale-105"
    : "bg-red-600 text-white hover:bg-red-700 hover:scale-105";

  const buttonReset = darkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105"
    : "bg-gray-400 text-white hover:bg-gray-500 hover:scale-105";

  const tipClass = `transition-opacity duration-300 ${
    tipFading ? "opacity-0" : "opacity-100"
  }`;

  return (
    <div
      className={`flex flex-col items-center text-center p-8 rounded-3xl max-h-[85vh] overflow-y-auto scrollbar-thin
        scrollbar-thumb-purple-600 scrollbar-track-purple-100
        ${bgCard} ${textMain} ${shadowCard} select-text`}
      style={{ scrollbarGutter: "stable" }}
    >
      <h2
        className="text-4xl font-extrabold mb-8 tracking-wide select-none"
        tabIndex={-1}
      >
        🚶 Go For a Walk
      </h2>
      <p className="text-lg mb-10 max-w-xl leading-relaxed font-medium">
        Take a break from your screen. Stretch your legs, and enjoy a peaceful walk.
      </p>

      <div
        className={`mb-6 font-mono text-5xl w-44 py-4 rounded-xl
          ${darkMode ? "bg-purple-800 text-purple-300" : "bg-purple-100 text-purple-800"}
          shadow-md select-none`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(seconds)}
      </div>

      <div className="flex space-x-6 mb-10">
        {!running && (
          <button
            onClick={() => setRunning(true)}
            className={`${buttonBase} ${buttonStart}`}
            aria-label="Start tracking walk"
          >
            Start Walk
          </button>
        )}
        {running && (
          <button
            onClick={() => setRunning(false)}
            className={`${buttonBase} ${buttonStop}`}
            aria-label="Stop tracking walk"
          >
            Stop Walk
          </button>
        )}
        <button
          onClick={resetTracking}
          className={`${buttonBase} ${buttonReset}`}
          aria-label="Reset walk tracking"
        >
          Reset
        </button>
      </div>

      <div
        className={`mb-10 font-semibold text-xl w-72 py-4 rounded-xl
          ${darkMode ? "bg-purple-700 text-purple-100" : "bg-purple-200 text-purple-900"}
          shadow-inner select-none`}
        aria-live="polite"
        aria-atomic="true"
      >
        Total Walked Time: {formatTime(totalSeconds)}
      </div>

      <div
        className={`max-w-xl p-6 mb-10 rounded-lg shadow-inner border
          ${darkMode
            ? "bg-purple-900 border-purple-700 text-purple-200"
            : "bg-purple-50 border-purple-300 text-purple-900"} ${tipClass}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="italic text-xl font-medium">💡 Tip: {tips[tipIndex]}</p>
        <button
          onClick={nextTip}
          className="mt-4 text-base font-semibold underline hover:text-purple-700 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label="Show another tip"
        >
          Show another tip
        </button>
      </div>
    </div>
  );
}
