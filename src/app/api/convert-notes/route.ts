import { NextResponse } from "next/server";
import { summarizeText } from "@/app/api/summarization/summary";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    // Calculate dynamic length based on input size
    const wordCount = notes.trim().split(/\s+/).length;
    const summaryLength = calculateSummaryLength(wordCount);
    const lyricsLength = calculateLyricsLength(wordCount);

    // Use the summarizeText function
    const summarizedNotes = await summarizeText(notes);

    // Create a custom streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // First send the summarized notes
          controller.enqueue(encoder.encode(`${summarizedNotes}\n\n`));

          // Make sure we have API key
          if (!process.env.OPENROUTER_KEY) {
            throw new Error("OpenRouter API key is not configured");
          }

          // Create lyrics using the OpenRouter API
          const openrouter = createOpenRouter({
            apiKey: process.env.OPENROUTER_KEY,
          });

          // Dynamic system prompt based on input length
          const verseCount = Math.max(
            1,
            Math.min(5, Math.floor(wordCount / 50))
          );

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
            maxTokens: lyricsLength,
          });

          // Stream the response
          const streamResponse = response.toTextStreamResponse();
          const reader = streamResponse.body?.getReader();
          if (!reader) {
            throw new Error("Failed to get response reader");
          }

          let lyrics = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            lyrics += text;
            controller.enqueue(encoder.encode(text));
          }

          // Convert lyrics to audio using ElevenLabs
          const client = new ElevenLabsClient();
          const audio = await client.textToSpeech.convert(
            "ui0NMIinCTg8KvB4ogeV",
            {
              text: lyrics,
              model_id: "eleven_multilingual_v2",
              output_format: "mp3_44100_128",
            }
          );

          const chunks: Uint8Array[] = [];
          for await (const chunk of audio as Readable) {
            chunks.push(chunk as Uint8Array);
          }
          const audioBuffer = Buffer.concat(chunks);

          // Create FormData and append the audio file
          const formData = new FormData();
          const audioBlob = new Blob([audioBuffer], { type: "audio/mpeg" });
          formData.append("lyrics_audio", audioBlob, "lyrics.mp3");

          // Send the audio to the FastAPI endpoint
          const audioResponse = await fetch(
            "https://audiomerger.onrender.com/merge",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!audioResponse.ok) {
            throw new Error(
              `Audio processing failed: ${audioResponse.statusText}`
            );
          }

          const audioData = await audioResponse.json();
          controller.enqueue(
            encoder.encode(`\n\nAudio URL: ${audioData.merged_audio_url}`)
          );
          controller.close();
        } catch (error) {
          console.error("Error in processing:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream);
  } catch (error) {
    console.error("Error creating lyrics:", error);
    return new Response("Error generating lyrics", { status: 500 });
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
  const words = summary.split(" ");
  const keyWords = words.filter((word) => word.length > 4).slice(0, 5);

  // More verses for longer inputs
  const verseCount = Math.max(1, Math.min(3, Math.floor(wordCount / 100)));
  let lyrics = `
In the digital world where knowledge flows,
${keyWords[0] || "Learning"} and ${
    keyWords[1] || "thinking"
  } as everybody knows,
${keyWords[2] || "Systems"} working day and night with ease,
${keyWords[3] || "Creating"} solutions with expertise.
`;

  if (verseCount >= 2) {
    lyrics += `
The power of ${keyWords[4] || "technology"} growing strong,
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
