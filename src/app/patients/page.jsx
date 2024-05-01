'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar'; 
import PatientsTable from '@/components/PatientTable';

export default function MainComponent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white p-5 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header or any content you want to put before your table */}
        <header className="flex justify-between items-center p-4 shadow-md">
          {/* Content of your header */}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <PatientsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
