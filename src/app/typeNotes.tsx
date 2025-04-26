"use client";
import React, { useState } from 'react';

export default function TypeNotes() {
  const [notes, setNotes] = useState('');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="relative w-[500px]">
        <textarea
          className="w-[500px] h-28 bg-stone-50 outline outline-1 outline-offset-[-0.50px] outline-neutral-200 rounded p-3 resize-none text-sm font-['Inter']"
          placeholder="Type your notes here..."
          value={notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  );
}