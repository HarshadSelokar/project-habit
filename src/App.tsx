import { useState } from 'react';
import { useAuth } from "./context/AuthContext";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import FullScreenLoader from "./components/ui/FullScreenLoader";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;

  return user ? <Dashboard /> : <Login />;
}
