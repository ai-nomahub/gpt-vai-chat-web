export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, message } = req.body;

    // force redeploy: webhook to production
    const response = await fetch("https://phamhai.app.n8n.cloud/webhook/c66b0484-d38e-4cda-85c6-1b728c13981f", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, message })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}
