import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";
import "dotenv/config";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const lyrics = body.lyrics;

    const client = new ElevenLabsClient();

    const audio = await client.textToSpeech.convert("ui0NMIinCTg8KvB4ogeV", {
      text: lyrics,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of audio as Readable) {
      chunks.push(chunk as Uint8Array);
    }
    const audioBuffer = Buffer.concat(chunks);

    const fastapiResponse = await fetch(
      "https://audiomerger.onrender.com/merge",
      {
        method: "POST",
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": audioBuffer.length.toString(),
        },
        body: audioBuffer,
      }
    );

    if (!fastapiResponse.ok) {
      throw new Error(`Audio processing failed: ${fastapiResponse.statusText}`);
    }

    const audioData = await fastapiResponse.json();
    return new Response(
      JSON.stringify({ audioUrl: audioData.merged_audio_url }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating audio:", error);
    return new Response(JSON.stringify({ error: "Error generating audio" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
