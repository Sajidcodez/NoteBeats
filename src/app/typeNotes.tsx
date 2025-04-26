'use client';

import React, { useState } from 'react';
import ConvertButton from './convertButton';

export default function TypeNotes() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');  // New state variable for summary
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API call to convert notes to lyrics
  const handleConvert = async () => {
    if (!notes.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSummary(''); // Clear previous summary
    setLyrics(''); // Clear previous lyrics
    
    try {
      // First get the summary
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.summary || '');
      }
      
      // Then get the lyrics (streaming)
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
      
      console.log('Conversion successful!');
      
    } catch (err) {
      console.error('Conversion failed:', err);
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
        placeholder="Enter your musical notes or lyrics here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={isLoading}
      ></textarea>
      
      {error && (
        <div className="text-red-500 mt-2">
          {error}
        </div>
      )}
      
      {/* Show summary if available */}
      {summary && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Summarized Notes:</h3>
          <div className="whitespace-pre-wrap">{summary}</div>
        </div>
      )}
      
      {/* Show lyrics if available */}
      {lyrics && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Generated Lyrics:</h3>
          <div className="whitespace-pre-wrap">{lyrics}</div>
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