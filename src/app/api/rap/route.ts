import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { summarizeText } from "@/app/api/summarization/summary";

export const POST = async (req: Request) => {
  try {
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_KEY!,
    });
    const body = await req.json();
    const summarizedNotes = await summarizeText(body.notes);
    const response = await streamText({
      model: openrouter("mistralai/mistral-nemo:free"),
      system: ``,
      messages: [
        {
          role: "user",
          content: `notes: ${summarizedNotes}`,
        },
      ],
    });

    
    return response.toTextStreamResponse();
  } catch (error) {
    console.error("Error creating response stream:", error);
    return new Response("Error processing request", { status: 500 });
  }
};
