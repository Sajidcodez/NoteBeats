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
    
    // Use the summarizeText function
    const summarizedNotes = await summarizeText(notes);
    
    // First return the summarized text
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        // First send the summarized notes
        controller.enqueue(encoder.encode(`Summarized Text: ${summarizedNotes}\n\n`));
        
        // Then proceed with streaming lyrics generation
        const generateLyrics = async () => {
          try {
            // Create lyrics using the OpenRouter API
            const openrouter = createOpenRouter({
              apiKey: process.env.OPENROUTER_KEY!,
            });
            
            const lyricsStream = await streamText({
              model: openrouter("mistralai/mistral-nemo:free"),
              system: `You are a lyric generator that creates song lyrics from summarized notes.`,
              messages: [
                {
                  role: "user",
                  content: `Generate song lyrics from these notes: ${summarizedNotes}`,
                },
              ],
            });
            
            // Fix: Get the reader directly from the stream response
            const reader = lyricsStream.getReader();
            
            // Read from the lyrics stream and add to our stream
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(encoder.encode(value));
            }
            
            // Complete our stream
            controller.close();
          } catch (error) {
            controller.enqueue(encoder.encode("\nError generating lyrics."));
            controller.close();
            console.error("Error in lyrics generation:", error);
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