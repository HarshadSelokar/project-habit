import { useState } from "react";
import { signIn, signUp } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl w-80 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          className="w-full p-2 rounded bg-muted"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 rounded bg-muted"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-accent py-2 rounded"
          onClick={() => signIn(email, password)}
        >
          Sign In
        </button>

        <button
          className="w-full text-sm text-gray-400"
          onClick={() => signUp(email, password)}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
