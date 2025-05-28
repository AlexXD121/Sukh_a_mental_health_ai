import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const musicFiles = [
  "/music/calm1.mp3",
  "/music/calm2.mp3",
  "/music/calm3.mp3",
  "/music/calm4.mp3",
  "/music/calm5.mp3",
];

export default function MusicPlayer({ isOpen, onClose, darkMode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * musicFiles.length);
      setCurrentTrackIndex(randomIndex);
      setIsMinimized(false);
    } else {
      setCurrentTrackIndex(0);
      setIsMinimized(false);
    }
  }, [isOpen]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % musicFiles.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) =>
      prev === 0 ? musicFiles.length - 1 : prev - 1
    );
  };

  const currentTrack = musicFiles[currentTrackIndex];

  const bgColor = darkMode ? "bg-[#1e293b]" : "bg-[#a3cef1]";
  const textColor = darkMode ? "text-blue-300" : "text-blue-900";
  const buttonHoverBg = darkMode ? "hover:bg-blue-700" : "hover:bg-blue-400";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={`absolute bottom-16 left-4 right-4 max-w-md mx-auto rounded-2xl shadow-lg flex flex-col z-50 ${bgColor} backdrop-blur-md transition-all duration-300`}
          style={{ overflow: "hidden" }}
          aria-label="Calm music player"
          role="region"
          tabIndex={0}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-2 cursor-move select-none"
            style={{ userSelect: "none" }}
          >
            <h3
              className={`font-semibold text-lg truncate ${textColor} select-none`}
            >
              🎵 Calm Music Player
            </h3>

            <div className="flex space-x-2">
              {/* Minimize/Maximize Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Maximize player" : "Minimize player"}
                className={`p-1 rounded ${textColor} ${buttonHoverBg} transition-colors`}
              >
                {isMinimized ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 4h16v16H4z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <line x1="4" y1="12" x2="20" y2="12" />
                  </svg>
                )}
              </motion.button>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close player"
                className={`p-1 rounded ${textColor} ${buttonHoverBg} transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Player Body */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                key="player-body"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-1 items-center justify-center px-6 space-y-4"
              >
                <audio
                  key={currentTrack}
                  src={currentTrack}
                  controls
                  autoPlay
                  className="w-full rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-400
                             accent-blue-500 dark:accent-blue-300"
                />

                <div className="flex space-x-8">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTrack}
                    aria-label="Previous track"
                    className={`px-5 py-2 rounded border border-blue-500 ${textColor} ${buttonHoverBg} transition-colors font-medium`}
                  >
                    ⏮ Prev
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTrack}
                    aria-label="Next track"
                    className={`px-5 py-2 rounded border border-blue-500 ${textColor} ${buttonHoverBg} transition-colors font-medium`}
                  >
                    Next ⏭
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized view: just a small bar */}
          <AnimatePresence>
            {isMinimized && (
              <motion.div
                key="minimized"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-center justify-center h-14 px-4`}
              >
                <p className={`${textColor} font-medium truncate`}>
                  Now Playing: Track {currentTrackIndex + 1}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
