import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Mainbox from "./components/MainBox";
import MusicPlayer from "./components/MusicPlayer";
import Meditation from "./components/Meditation";
import JournalPage from "./components/JournalPage";
import GoForAWalk from "./components/GoForAWalk";

import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  // Authentication state
  const [user, setUser] = useState(null); // null means not logged in
  const [showLogin, setShowLogin] = useState(true); // toggle between login/signup UI

  // Existing UI states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [musicPlayerOpen, setMusicPlayerOpen] = useState(false);
  const [meditationOpen, setMeditationOpen] = useState(false);
  const [journalOpen, setJournalOpen] = useState(false);
  const [walkOpen, setWalkOpen] = useState(false);

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggle sidebar open/close
  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), []);

  // Toggle dark mode and save preference
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  // Close all page modals
  const closeAll = useCallback(() => {
    setMusicPlayerOpen(false);
    setMeditationOpen(false);
    setJournalOpen(false);
    setWalkOpen(false);
  }, []);

  // Open one page modal and close others, also close sidebar
  const openPage = useCallback(
    (pageSetter) => {
      closeAll();
      pageSetter(true);
      setSidebarOpen(false);
    },
    [closeAll]
  );

  // Close sidebar on Escape key for accessibility
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  // Handlers for login and signup
  const handleLogin = (email, password) => {
    // TODO: Replace with real authentication
    console.log("Logging in:", email, password);
    setUser({ email }); // mock logged-in user
  };

  const handleSignup = (email, password) => {
    // TODO: Replace with real signup logic
    console.log("Signing up:", email, password);
    setUser({ email }); // mock logged-in user
  };

  // Handler for logout (optional)
  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
  };

  // If user not logged in, show Login/Signup UI
  if (!user) {
    return (
      <div
        className={`font-poppins min-h-screen w-screen flex items-center justify-center transition-colors duration-500 ${
          darkMode ? "bg-gray-900" : "bg-[#89CFF0]"
        }`}
      >
        <motion.div
          className="font-poppins bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-[90vw] max-w-[450px] h-[90vh] max-h-[700px] relative overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {showLogin ? (
            <Login
              onLogin={handleLogin}
              onSwitchToSignup={() => setShowLogin(false)}
            />
          ) : (
            <Signup
              onSignup={handleSignup}
              onSwitchToLogin={() => setShowLogin(true)}
            />
          )}
        </motion.div>
      </div>
    );
  }

  // User is logged in — show main app UI

  return (
    <div
      className={`font-poppins min-h-screen w-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-gray-900" : "bg-[#89CFF0]"
      }`}
      tabIndex={-1}
      aria-live="polite"
      aria-atomic="true"
    >
      <motion.div
        className="font-poppins bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-[90vw] max-w-[450px] h-[90vh] max-h-[700px] relative overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-full h-full bg-black z-30 backdrop-blur"
              onClick={toggleSidebar}
              role="button"
              aria-label="Close sidebar overlay"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleSidebar();
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Header with logout button */}
        <Header
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
          onLogout={handleLogout} // pass logout to header if you want
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCalmMusicClick={() => openPage(setMusicPlayerOpen)}
          onMeditationClick={() => openPage(setMeditationOpen)}
          onJournalClick={() => openPage(setJournalOpen)}
          onGoForWalkClick={() => openPage(setWalkOpen)}
        />

        {/* Main content area */}
        <AnimatePresence mode="wait">
          {musicPlayerOpen && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <MusicPlayer
                isOpen={musicPlayerOpen}
                onClose={() => setMusicPlayerOpen(false)}
                darkMode={darkMode}
              />
            </motion.div>
          )}

          {meditationOpen && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <Meditation
                isOpen={meditationOpen}
                onClose={() => setMeditationOpen(false)}
                darkMode={darkMode}
              />
            </motion.div>
          )}

          {journalOpen && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <JournalPage darkMode={darkMode} />
            </motion.div>
          )}

          {walkOpen && (
            <motion.div
              key="walk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <GoForAWalk darkMode={darkMode} />
            </motion.div>
          )}

          {/* Default Mainbox */}
          {!musicPlayerOpen && !meditationOpen && !journalOpen && !walkOpen && (
            <motion.div
              key="mainbox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="h-full flex flex-col"
            >
              <Mainbox />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
