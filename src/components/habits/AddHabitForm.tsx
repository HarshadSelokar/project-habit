import { useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  userId: string;
  onCreated?: () => void;
};

export default function AddHabitForm({ userId, onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHabit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Please enter a habit name.");
      return;
    }
    if (!userId) {
      setError("User not signed in.");
      return;
    }

    setLoading(true);
    const { data, error: err } = await supabase
      .from("habits")
      .insert([{ user_id: userId, name }]);

    if (err) setError(err.message || "Failed to create habit");
    else {
      setName("");
      onCreated?.();
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg mb-4">
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
          placeholder="New habit (e.g., Read 10 pages)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-60"
          onClick={createHabit}
          disabled={loading || !userId}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
    </div>
  );
}
