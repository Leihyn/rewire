"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./Dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-400 text-xl">Loading PhysioPrep...</div>
    </div>
  ),
});

export default function ClientApp() {
  return <Dashboard />;
}
