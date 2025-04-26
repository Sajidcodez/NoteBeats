"use client"

import React from 'react';

export default function ShowAudio() {
  return (
    <div className="flex flex-col items-center mt-4">
      <div className="w-[500px] relative">
        {/* Audio player container */}
        <div className="w-[500px] h-7 bg-indigo-50 outline outline-1 outline-offset-[-0.50px] outline-blue-500 rounded flex items-center px-2">
          {/* Play button */}
          <div className="w-5 h-5 bg-blue-500 rounded-sm cursor-pointer" />
          
          {/* Progress bar container */}
          <div className="flex-1 mx-3 relative">
            <div className="w-full h-2.5 bg-indigo-100 rounded-full">
              <div className="w-48 h-2.5 bg-indigo-200 rounded-full absolute left-0" />
            </div>
          </div>
          
          {/* Time display */}
          <div className="text-right justify-start text-blue-500 text-xs font-normal font-['Inter']">
            0:00 / 0:00
          </div>
        </div>
      </div>
    </div>
  );
}