import { useState } from "react";
import { signIn, signUp } from "../lib/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-950 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-center">Welcome back</h1>
          <img src="/react.svg" alt="logo" className="h-6 w-6 opacity-80" />
        </div>

        <label className="text-sm text-gray-400">Email</label>
        <input
          className="w-full p-3 rounded bg-gray-900 border border-gray-800 mb-3"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="text-sm text-gray-400">Password</label>
        <input
          type="password"
          className="w-full p-3 rounded bg-gray-900 border border-gray-800 mb-4"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-sm text-red-400 mb-2">{error}</div>
        )}

        {success ? (
          <div className="mb-4">
            <div className="text-sm text-green-400 mb-3">{success}</div>
            <button
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
              onClick={() => setSuccess(null)}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <button
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold mb-2 disabled:opacity-60"
          onClick={async () => {
            setError(null);
            if (!email || !password) {
              setError("Please enter email and password.");
              return;
            }
            setLoading(true);
            try {
              const { data, error: err } = await signIn(email, password);
              if (err) setError(err.message || "Sign in failed");
            } catch (e: any) {
              setError(e?.message || "Sign in failed");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

            <button
              className="w-full text-sm text-gray-400"
              onClick={async () => {
                setError(null);
                if (!email || !password) {
                  setError("Please enter email and password.");
                  return;
                }
                if (password.length < 6) {
                  setError("Password must be at least 6 characters.");
                  return;
                }
                setLoading(true);
                try {
                  const { data, error: err } = await signUp(email, password);
                  if (err) {
                    setError(err.message || "Sign up failed");
                  } else {
                    setSuccess("Account created. Check your email for confirmation.");
                  }
                } catch (e: any) {
                  setError(e?.message || "Sign up failed");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}
