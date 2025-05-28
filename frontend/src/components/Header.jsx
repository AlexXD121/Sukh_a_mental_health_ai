import { GiHamburgerMenu } from 'react-icons/gi';
import { BsMoon, BsSun } from 'react-icons/bs';
import { motion } from 'framer-motion';

export default function Header({ toggleSidebar, toggleDarkMode, darkMode }) {
  return (
    <motion.header
      role="banner"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="w-full p-4 bg-[#3A8DCC]/70 dark:bg-[#1E2A47]/70 text-white flex justify-between items-center
        backdrop-blur-md rounded-t-3xl shadow-md z-10"
    >
      {/* Stylish Logo + Name */}
      <div className="flex items-center gap-3 select-none">
        <div className="bg-white text-[#3A8DCC] dark:text-[#1E2A47] font-bold rounded-full w-9 h-9 flex items-center justify-center text-xl shadow-md">
          S
        </div>
        <h1
          className="text-xl font-bold tracking-wide font-poppins"
          tabIndex={0}
        >
          S
          <span className="text-yellow-300">u</span>
          kh
        </h1>
      </div>

      {/* Dark Mode + Menu Toggle */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none transition-all duration-300"
          tabIndex={0}
        >
          {darkMode ? <BsSun size={24} /> : <BsMoon size={24} />}
        </motion.button>

        <motion.button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none"
          tabIndex={0}
        >
          <GiHamburgerMenu size={24} />
        </motion.button>
      </div>
    </motion.header>
  );
}
