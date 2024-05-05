"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import DoctorsTable from "@/components/DoctorsTable";

export default function MainComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Show alert and redirect after 3 seconds
      alert(
        "Please log in to view this page. You will be redirected to the login page."
      );
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loader />;
  }

  if (!session) {
    return null; // The alert and redirection is handled in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <button
        className="p-4 text-gray-600 focus:outline-none md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white p-5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <Sidebar activeItem={'Doctors'}/>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 shadow-md">
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <DoctorsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
