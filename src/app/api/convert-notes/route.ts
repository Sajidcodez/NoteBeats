import { NextResponse } from 'next/server';
import { summarizeText } from '@/app/api/summarization/summary';
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();
    
    if (!notes || typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      );
    }
    
    // Calculate dynamic length based on input size
    const wordCount = notes.trim().split(/\s+/).length;
    const summaryLength = calculateSummaryLength(wordCount);
    const lyricsLength = calculateLyricsLength(wordCount);
    
    // Use the summarizeText function 
    // Note: We're not passing the summaryLength since the original function doesn't accept it
    const summarizedNotes = await summarizeText(notes);
    
    // Create a custom streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        // First send the summarized notes
        controller.enqueue(encoder.encode(`${summarizedNotes}\n\n`));
        
        // Then proceed with streaming lyrics generation
        const generateLyrics = async () => {
          try {
            // Make sure we have API key
            if (!process.env.OPENROUTER_KEY) {
              throw new Error('OpenRouter API key is not configured');
            }
            
            // Create lyrics using the OpenRouter API
            const openrouter = createOpenRouter({
              apiKey: process.env.OPENROUTER_KEY,
            });
            
            // Dynamic system prompt based on input length
            const verseCount = Math.max(1, Math.min(5, Math.floor(wordCount / 50)));
            
            try {
              const response = await streamText({
                model: openrouter("mistralai/mistral-nemo:free"),
                system: `You are a lyric generator that creates song lyrics from summarized notes. Create a song with ${verseCount} verse(s) and a chorus based on the provided notes.`,
                messages: [
                  {
                    role: "user",
                    content: `Generate song lyrics from these notes: ${summarizedNotes}`,
                  },
                ],
                temperature: 0.7,
                max_tokens: lyricsLength,
              });
              
              // Get the reader from the response
              const reader = response.getReader();
              
              // Read from the response stream and add to our stream
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                controller.enqueue(encoder.encode(value));
              }
            } catch (streamError) {
              console.error("Error in AI stream:", streamError);
              throw streamError;
            }
            
            // Complete our stream
            controller.close();
          } catch (error) {
            console.error("Error in lyrics generation:", error);
            
            // Generate a simple fallback lyric based on the summary
            const fallbackLyrics = generateFallbackLyrics(summarizedNotes, wordCount);
            controller.enqueue(encoder.encode(fallbackLyrics));
            controller.close();
          }
        };
        
        // Start the lyrics generation asynchronously
        generateLyrics();
      }
    });
    
    // Return our custom stream
    return new Response(readableStream);
    
  } catch (error) {
    console.error('Error creating lyrics:', error);
    return new Response('Error generating lyrics', { status: 500 });
  }
}

// Helper function to calculate summary length based on input size
function calculateSummaryLength(wordCount: number): number {
  // Base minimum of 50 tokens, up to 150 for very long inputs
  return Math.min(150, Math.max(50, Math.floor(wordCount * 0.4)));
}

// Helper function to calculate lyrics length based on input size
function calculateLyricsLength(wordCount: number): number {
  // Base minimum of 100 tokens, up to 400 for very long inputs
  return Math.min(400, Math.max(100, wordCount * 2));
}

// Helper function to create simple fallback lyrics when the API fails
function generateFallbackLyrics(summary: string, wordCount: number) {
  // Extract key phrases (just a simple approach)
  const words = summary.split(' ');
  const keyWords = words.filter(word => word.length > 4).slice(0, 5);
  
  // More verses for longer inputs
  const verseCount = Math.max(1, Math.min(3, Math.floor(wordCount / 100)));
  let lyrics = `
In the digital world where knowledge flows,
${keyWords[0] || 'Learning'} and ${keyWords[1] || 'thinking'} as everybody knows,
${keyWords[2] || 'Systems'} working day and night with ease,
${keyWords[3] || 'Creating'} solutions with expertise.
`;

  if (verseCount >= 2) {
    lyrics += `
The power of ${keyWords[4] || 'technology'} growing strong,
Innovation and discovery moving along,
Challenges become opportunities in our hands,
As we build the future across many lands.
`;
  }
  
  if (verseCount >= 3) {
    lyrics += `
Together we journey through data and code,
Discovering patterns as stories unfold,
Creating tomorrow with what we know today,
Lighting the path and showing the way.
`;
  }

  return lyrics;
}
