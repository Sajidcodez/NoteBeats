import { pipeline } from "@huggingface/transformers";

const generator = await pipeline("summarization", "Xenova/distilbart-cnn-6-6");

export async function summarizeText(originalText) {
  try {
    // Summarize the text
    const summary = await generator(originalText, {
      max_new_tokens: 100, // adjust if needed
    });

    const summarizedText = summary[0]?.summary_text || "";

    console.log("Summarized Text:", summarizedText);

    return summarizedText; // returns summarized text for LLM to use in api/rap/route.ts
  } catch (error) {
    return new Response("Error summarizing", error);
  }
}
