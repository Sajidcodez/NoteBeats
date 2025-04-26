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
    
    // Use the summarizeText function to summarize the notes
    const summarizedNotes = await summarizeText(notes);
    
    // Create lyrics using the OpenRouter API
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_KEY!,
    });
    
    const response = await streamText({
      model: openrouter("mistralai/mistral-nemo:free"),
      system: `You are a lyric generator that creates song lyrics from summarized notes. Your output should be just the lyrics, formatted as a song.`,
      messages: [
        {
          role: "user",
          content: `Generate song lyrics from these notes: ${summarizedNotes}`,
        },
      ],
    });
    
    // Return streaming response with lyrics
    return response.toTextStreamResponse();
    
  } catch (error) {
    console.error('Error creating lyrics:', error);
    return new Response('Error generating lyrics', { status: 500 });
  }
}