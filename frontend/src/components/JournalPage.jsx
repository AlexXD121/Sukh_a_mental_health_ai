import { useState, useEffect, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function JournalPage({ darkMode, onClose }) {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [focused, setFocused] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem("journalDraft");
    if (draft) setEntry(draft);
  }, []);

  // Auto-save draft every 5 seconds if not saved
  useEffect(() => {
    if (saved) return; // don't auto-save once saved
    const interval = setInterval(() => {
      localStorage.setItem("journalDraft", entry);
    }, 5000);
    return () => clearInterval(interval);
  }, [entry, saved]);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgColor = darkMode ? "bg-gray-900" : "bg-blue-100";
  const textColor = darkMode ? "text-blue-100" : "text-blue-900";
  const inputBg = darkMode ? "bg-gray-800" : "bg-white";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const buttonBg = darkMode
    ? "bg-purple-700 hover:bg-purple-600"
    : "bg-purple-600 hover:bg-purple-700";
  const promptText = darkMode ? "text-blue-300" : "text-blue-800";

  // Calculate max height for container so it fits window but leaves space for header & padding etc
  const containerMaxHeight = windowHeight - 170;

  const saveEntry = async () => {
    if (!entry.trim()) {
      alert("Please write something before saving.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "journalEntries"), {
        text: entry,
        createdAt: serverTimestamp(),
      });
      alert("✅ Your journal entry has been saved!");
      setSaved(true);
      localStorage.removeItem("journalDraft");
    } catch (error) {
      console.error("Error saving entry: ", error);
      alert("❌ Failed to save your entry. Try again.");
    }
    setLoading(false);
  };

  const newEntry = () => {
    setEntry("");
    setSaved(false);
    localStorage.removeItem("journalDraft");
    setShowPreview(false);
  };

  // Character count
  const charCount = entry.length;

  return (
    <div
      className={`min-h-screen p-4 flex flex-col items-center relative ${bgColor} ${textColor}`}
      style={{ overflow: "hidden" }}
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close Journal"
          className={`absolute top-4 right-4 text-xl font-bold rounded-full px-2 py-1 hover:bg-red-600 hover:text-white transition ${darkMode ? "text-blue-300" : "text-blue-900"}`}
        >
          ❌
        </button>
      )}

      <div
        className="w-full max-w-md flex flex-col"
        style={{ maxHeight: containerMaxHeight, overflow: "hidden" }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">📝 Daily Journal</h1>

        {/* Prompts section without scroll */}
        <div className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 ${promptText}`}>
            Prompts to help you reflect:
          </h2>
          <ul className={`space-y-1 list-disc list-inside text-sm ${promptText}`}>
            <li>✨ What good happened to you today?</li>
            <li>🌧️ What bad or challenging things did you experience?</li>
            <li>📅 How was your overall day?</li>
            <li>🧠 How was your mental health today?</li>
            <li>📈 Did you make any progress compared to yesterday?</li>
            <li>💭 Any thoughts, reflections, or goals for tomorrow?</li>
          </ul>
        </div>

        {/* Edit/Preview toggle */}
        <div className="mb-2 flex justify-end items-center space-x-4 text-sm">
          <label className="flex items-center space-x-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview(!showPreview)}
              className="cursor-pointer"
            />
            <span>{showPreview ? "Preview" : "Edit"}</span>
          </label>
        </div>

        <AnimatePresence mode="wait">
          {!saved ? (
            <motion.div
              key="addEntry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-2 text-right flex-shrink-0"
            >
              <button
                onClick={saveEntry}
                disabled={loading || !entry.trim()}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`
                  px-5 py-2 text-white rounded-md font-medium transition 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${buttonBg} 
                  hover:scale-105 hover:shadow-lg
                  ${focused ? "animate-pulse" : ""}
                `}
              >
                {loading ? "Saving..." : "➕ Add Entry"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="newEntry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-2 text-center flex-shrink-0"
            >
              <button
                onClick={newEntry}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition hover:scale-105 hover:shadow-lg"
              >
                🆕 New Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea or Markdown Preview */}
        {showPreview ? (
          <motion.div
            key="preview"
            className={`p-4 rounded-lg border ${inputBg} ${borderColor} overflow-auto`}
            style={{ height: containerMaxHeight - 160, fontSize: "0.9rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {entry.trim() ? (
              <ReactMarkdown>{entry}</ReactMarkdown>
            ) : (
              <p className={textColor}>Nothing to preview yet...</p>
            )}
          </motion.div>
        ) : (
          <motion.textarea
            key="edit"
            rows="12"
            placeholder="Start writing your thoughts here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full p-4 rounded-lg border ${inputBg} ${borderColor} focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm ${textColor} resize-none`}
            style={{
              height: containerMaxHeight - 160,
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: darkMode ? "#7c3aed #1f2937" : "#a78bfa #e0e7ff",
            }}
            disabled={loading || saved}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Character count */}
        <div
          className={`text-xs mt-1 text-right ${textColor} select-none`}
          style={{ userSelect: "none" }}
        >
          {charCount} character{charCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Custom scrollbar styles for WebKit browsers */}
      <style>{`
        textarea::-webkit-scrollbar {
          width: 8px;
          transition: background-color 0.3s ease;
        }
        textarea::-webkit-scrollbar-track {
          background: ${darkMode ? "#1f2937" : "#e0e7ff"};
          border-radius: 10px;
          transition: background-color 0.3s ease;
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: ${darkMode ? "#7c3aed" : "#a78bfa"};
          border-radius: 10px;
          border: 2px solid ${darkMode ? "#1f2937" : "#e0e7ff"};
          transition: background-color 0.3s ease;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background-color: ${darkMode ? "#9d4edd" : "#c4b5fd"};
        }
        button {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
      `}</style>
    </div>
  );
}
