import { useEffect } from "react";

export default function Sidebar({
  isOpen,
  onClose, // New optional prop to close sidebar from inside
  onCalmMusicClick,
  onMeditationClick,
  onJournalClick,
  onGoForWalkClick,
}) {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    if (isOpen) {
      mainContent.classList.add("blur-sm", "pointer-events-none", "transition-blur", "duration-300");
    } else {
      mainContent.classList.remove("blur-sm", "pointer-events-none", "transition-blur", "duration-300");
    }

    // Cleanup on unmount
    return () => {
      mainContent.classList.remove("blur-sm", "pointer-events-none", "transition-blur", "duration-300");
    };
  }, [isOpen]);

  // Handler to wrap click and close sidebar if onClose exists
  const handleClick = (handler) => () => {
    if (typeof handler === "function") handler();
    if (typeof onClose === "function") onClose();
  };

  return (
    <aside
      className={`
        font-poppins fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out
        bg-purple-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}
      aria-label="Relax options sidebar"
      role="complementary"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Close button top-right */}
        <button
          onClick={onClose}
          aria-label="Close sidebar"
          className="self-end text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
        >
          ✕
        </button>

        <h2
          className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-6 select-none"
          tabIndex={-1}
        >
          Relax Options 🌿
        </h2>

        <nav aria-label="Relaxation options navigation" className="flex-grow">
          <ul className="space-y-5 text-base">
            <li>
              <button
                onClick={handleClick(onCalmMusicClick)}
                className="w-full text-left hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 py-1"
                aria-pressed="false"
              >
                🎵 Calm Music
              </button>
            </li>
            <li>
              <button
                onClick={handleClick(onMeditationClick)}
                className="w-full text-left hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 py-1"
                aria-pressed="false"
              >
                🧘 Meditation
              </button>
            </li>
            <li>
              <button
                onClick={handleClick(onJournalClick)}
                className="w-full text-left hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 py-1"
                aria-pressed="false"
              >
                📓 Daily Journal
              </button>
            </li>
            <li>
              <button
                onClick={handleClick(onGoForWalkClick)}
                className="w-full text-left hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 py-1"
                aria-pressed="false"
              >
                🚶 Go For a Walk
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
