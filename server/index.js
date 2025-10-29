import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT ?? 8080;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "../dist");

function extractJsonBlock(raw) {
  const fence = /```json([\s\S]*?)```/i;
  const match = typeof raw === "string" ? raw.match(fence) : null;
  if (match) return match[1].trim();
  return typeof raw === "string" ? raw.trim() : "";
}

function normalizeAiWordItems(payload) {
  if (!Array.isArray(payload)) return [];
  return payload
    .map((item) => {
      const word = String(item?.word ?? "").trim();
      if (!word) return null;
      return {
        word,
        syll: String(item?.syll ?? "").trim(),
        def: String(item?.def ?? "").trim(),
        sent: String(item?.sent ?? "").trim(),
        cat: String(item?.cat ?? "AI").trim() || "AI",
      };
    })
    .filter(Boolean);
}

app.use(express.json());

app.post("/api/openai/word-bank", async (req, res) => {
  const requestedCount = Number(req.body?.wordCount) || 10;
  const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY environment variable." });
    return;
  }

  const prompt = `Generate a JSON array of ${Math.max(requestedCount, 10)} unique English spelling-bee words for grades 4-6. Each item must be an object with the keys word, syll, def, sent, and cat. Use kid-friendly language. Respond with JSON only.`;
  const requestPayload = {
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates educational word lists for middle grade spelling bees.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
  };

  try {
    console.info("[OpenAI API] Request", { wordCount: requestedCount });
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[OpenAI API] Error", response.status, errorText);
      res.status(response.status).json({ error: errorText || "OpenAI request failed." });
      return;
    }

    const data = await response.json();
    console.info("[OpenAI API] Response", {
      status: response.status,
      usage: data?.usage ?? null,
      choices: data?.choices?.length ?? 0,
    });

    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      res.status(502).json({ error: "OpenAI response missing content." });
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(extractJsonBlock(rawContent));
    } catch (err) {
      console.error("[OpenAI API] JSON parse error", err);
      res.status(502).json({ error: "Unable to parse OpenAI JSON payload." });
      return;
    }

    const words = normalizeAiWordItems(parsed);
    if (!words.length) {
      res.status(502).json({ error: "OpenAI returned no usable words." });
      return;
    }

    res.json({ words, usage: data?.usage ?? null });
  } catch (err) {
    console.error("[OpenAI API] Unexpected failure", err);
    res.status(500).json({ error: "Internal error while contacting OpenAI." });
  }
});

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
