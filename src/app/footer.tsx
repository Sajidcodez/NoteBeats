

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="w-full h-14 bg-zinc-800 flex items-center justify-between px-8">
        <div className="justify-start text-neutral-400 text-sm font-normal font-['Inter']">
          © 2025 NoteBeats
        </div>
        <div className="flex space-x-6">
          <div className="justify-start text-neutral-400 text-sm font-normal font-['Inter'] cursor-pointer hover:text-neutral-300">
            Privacy
          </div>
          <div className="justify-start text-neutral-400 text-sm font-normal font-['Inter'] cursor-pointer hover:text-neutral-300">
            Terms
          </div>
          <div className="justify-start text-neutral-400 text-sm font-normal font-['Inter'] cursor-pointer hover:text-neutral-300">
            Contact
          </div>
        </div>
      </div>
    </footer>
  );
}
