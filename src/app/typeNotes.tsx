
'use client';

import React, { useState } from 'react';
import ConvertButton from './convertButton';

export default function TypeNotes() {
  const [notes, setNotes] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API call to convert notes to lyrics
  const handleConvert = async () => {
    if (!notes.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setLyrics(''); // Clear previous lyrics
    
    try {
      // Get lyrics from convert-notes API
      const response = await fetch('/api/convert-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        result += chunk;
        setLyrics(result); // Update as streaming comes in
      }
      
      console.log('Lyrics generation successful!');
      
    } catch (err) {
      console.error('Lyrics generation failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Type Your Notes</h2>
      <textarea
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your notes here to generate song lyrics..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isLoading}
      ></textarea>
      
      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}
      
      {/* Show lyrics with proper formatting when available */}
      {lyrics && (
        <div className="mt-6 p-6 bg-gray-100 border border-gray-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">Your Song Lyrics</h3>
          <div className="whitespace-pre-line font-serif text-lg leading-relaxed">
            {lyrics}
          </div>
        </div>
      )}
      
      {/* ConvertButton */}
      <div className="flex justify-center mt-4">
        <ConvertButton 
          onClick={handleConvert} 
          isLoading={isLoading}
          disabled={isLoading}
          notes={notes}
        />
      </div>
    </div>
  );
}
