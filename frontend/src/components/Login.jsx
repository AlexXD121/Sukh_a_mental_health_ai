import { useState } from "react";

export default function Login({ onSwitchToSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password); // pass login data to parent (future Firebase or backend)
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Welcome Back 👋</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
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
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        New here?{" "}
        <button onClick={onSwitchToSignup} className="text-blue-500 underline">
          Create an account
        </button>
      </p>
    </div>
  );
}
