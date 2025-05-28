import { useEffect, useState, useRef, useCallback } from "react";

export default function Meditation({ isOpen, onClose, darkMode }) {
  const [duration, setDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startMeditation = () => {
    if (duration > 0) {
      setSecondsLeft(duration * 60);
      setIsRunning(true);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          setIsRunning(false);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onClose]);

  useEffect(() => {
    if (!isRunning && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isRunning]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        clearInterval(intervalRef.current);
        setIsRunning(false);
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const togglePause = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      if (audioRef.current) audioRef.current.pause();
    } else if (secondsLeft > 0) {
      setIsRunning(true);
      if (audioRef.current) audioRef.current.play().catch(() => {});
    }
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  // Colors updated to soft pastels & harmonious
  const bgColor = darkMode
    ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
    : "bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100";
  const textColor = darkMode ? "text-indigo-200" : "text-purple-900";
  const inputTextColor = darkMode ? "text-indigo-100" : "text-purple-700";

  const buttonBase =
    "px-5 py-2 rounded-xl font-semibold transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400";

  // Soft pastel button colors with hover scale & lighten effect
  const buttonPrimary = darkMode
    ? "bg-indigo-700 text-indigo-100 hover:bg-indigo-600 hover:scale-105"
    : "bg-purple-400 text-purple-900 hover:bg-purple-300 hover:scale-105";

  const buttonSecondary = darkMode
    ? "bg-purple-700 text-purple-200 hover:bg-purple-600 hover:scale-105"
    : "bg-pink-300 text-pink-900 hover:bg-pink-200 hover:scale-105";

  const buttonStop = darkMode
    ? "bg-red-600 text-red-100 hover:bg-red-500 hover:scale-105"
    : "bg-red-400 text-red-900 hover:bg-red-300 hover:scale-105";

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="meditation-title"
      tabIndex={-1}
    >
      <div
        className={`${bgColor} ${textColor} max-w-md w-full rounded-3xl shadow-2xl p-8
          transform transition-transform duration-400 ease-in-out
          hover:shadow-3xl
          flex flex-col relative
          `}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            clearInterval(intervalRef.current);
            setIsRunning(false);
            onClose();
          }}
          aria-label="Close meditation"
          className="absolute top-5 right-5 p-2 rounded-full text-xl text-opacity-60 hover:text-opacity-100
          transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h3
          id="meditation-title"
          className="font-extrabold text-2xl mb-6 select-none tracking-wide"
        >
          🧘 Guided Meditation
        </h3>

        {!isRunning ? (
          <>
            <label
              htmlFor="meditation-timer"
              className={`mb-3 block font-semibold select-none ${inputTextColor} tracking-wide`}
            >
              Set your meditation timer (minutes):
            </label>
            <input
              id="meditation-timer"
              type="number"
              min="1"
              max="60"
              value={duration}
              onChange={(e) =>
                setDuration(Math.max(1, Math.min(60, +e.target.value)))
              }
              ref={inputRef}
              disabled={isRunning}
              className={`w-full p-3 rounded-xl border border-transparent
                focus:outline-none focus:ring-4 focus:ring-purple-300
                bg-white text-purple-900 shadow-md
                dark:bg-gray-800 dark:text-indigo-100
                ${inputTextColor}`}
              aria-label="Meditation timer in minutes"
            />
            <button
              onClick={startMeditation}
              disabled={isRunning}
              className={`${buttonBase} ${buttonPrimary} mt-8 w-full`}
            >
              Start Meditation
            </button>
          </>
        ) : (
          <>
            <p className="mb-6 text-center select-none tracking-wide text-lg font-semibold">
              Meditation in progress. Relax and focus on your breath.
            </p>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="text-center text-6xl font-mono font-extrabold text-purple-600 dark:text-purple-300 mb-8 select-text tracking-wider"
            >
              {formatTime(secondsLeft)}
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={togglePause}
                className={`${buttonBase} ${buttonSecondary} w-1/2`}
              >
                {isRunning ? "⏸ Pause" : "▶️ Resume"}
              </button>
              <button
                onClick={() => {
                  clearInterval(intervalRef.current);
                  setIsRunning(false);
                  setSecondsLeft(null);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  onClose();
                }}
                className={`${buttonBase} ${buttonStop} w-1/2`}
              >
                ✖️ Stop & Close
              </button>
            </div>

            <audio
              ref={audioRef}
              src="/music/meditation3.mp3"
              autoPlay
              loop
              muted={false}
              style={{ display: "none" }}
            />
          </>
        )}
      </div>
    </div>
  );
}
