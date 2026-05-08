import { Outlet, NavLink } from "react-router-dom";
import { Upload, MessageSquare, Cpu } from "lucide-react";
import { TopNavBar } from "./TopNavBar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
     <TopNavBar />
      <main className="max-w-5xl mx-auto p-6">
        <Outlet /> 
      </main>
    </div>
  );
}

