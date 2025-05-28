import { useState } from "react";

export default function Signup({ onSwitchToLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    onSignup(email, password); // future Firebase or backend call
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Create Account 🧘</h2>
      <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none dark:bg-gray-800 dark:border-gray-600"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none dark:bg-gray-800 dark:border-gray-600"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="text-blue-500 underline">
          Login
        </button>
      </p>
    </div>
  );
}
