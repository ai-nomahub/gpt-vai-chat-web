export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://chat.nomahubvn.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Chỉ chấp nhận POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { vai, prompt } = req.body;

    const messages = [
      { role: "system", content: vai || "Bạn là trợ lý AI phản hồi đúng vai." },
      { role: "user", content: prompt }
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7
      })
    });

    const result = await openaiRes.json();

    if (!openaiRes.ok) {
      throw new Error(result.error?.message || "OpenAI API error");
    }

    const reply = result.choices?.[0]?.message?.content || "[GPT không phản hồi hợp lệ]";

    res.setHeader("Access-Control-Allow-Origin", "https://chat.nomahubvn.com");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "GPT proxy error", details: error.message });
  }
}
