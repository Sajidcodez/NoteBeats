
'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-500 fixed top-0 left-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-white text-2xl font-bold font-['Inter']">NoteBeats</div>
          </div>
          
          {/* Navigation links */}
          <div className="hidden sm:flex items-center space-x-8">
            <Link href="/" className="text-white text-base font-normal font-['Inter'] hover:text-gray-200 transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-white text-base font-normal font-['Inter'] hover:text-gray-200 transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-white text-base font-normal font-['Inter'] hover:text-gray-200 transition-colors">
              About
            </Link>
          </div>
          
          {/* Menu displayed on small screens */}
          <div className="sm:hidden flex items-center">
            <Link href="/" className="text-white text-sm font-normal font-['Inter'] px-2">
              Home
            </Link>
            <Link href="/features" className="text-white text-sm font-normal font-['Inter'] px-2">
              Features
            </Link>
            <Link href="/about" className="text-white text-sm font-normal font-['Inter'] px-2">
              About
            </Link>
            
          </div>
        </div>
      </div>
    </nav>
  );
}


