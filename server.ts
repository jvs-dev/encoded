import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Sitemap Route
  app.get("/sitemap.xml", (req, res) => {
    res.header("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.incoded.com.br/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.incoded.com.br/contato</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.incoded.com.br/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.incoded.com.br/webdata</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.incoded.com.br/dashboard</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.incoded.com.br/prospect</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
  });

  // AI Audit Route
  app.post("/api/audit", async (req, res) => {
    try {
      const { businessInfo } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
        Você é um Engenheiro Digital Sênior da INCODED, uma agência de elite.
        Analise o seguinte negócio/desafio relatado pelo usuário: "${businessInfo}"
        
        Sua tarefa é fornecer um 'Digital Diagnostic' (Diagnóstico Digital) conciso e impactante (máximo 4 parágrafos pequenos).
        1. Identifique os gargalos prováveis no digital.
        2. Dê um conselho estratégico "fora da caixa".
        3. Recomende qual destes serviços da INCODED é o mais urgente:
           - Criação de Sites/Landing Pages (para conversão)
           - Sistemas Web Sob Medida (para automação/processos)
           - Identidade Visual & Branding (para autoridade)
           - Gestão de Redes Sociais (para engajamento)
        
        Seja profissional, mas com um toque de "ousadia" e foco total em resultados reais (ROI).
        Use Markdown para formatar. Responda em Português do Brasil.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      res.json({ analysis: response.text });
    } catch (error) {
      console.error("AI Audit error:", error);
      res.status(500).json({ error: "Falha na análise. Tente novamente mais tarde." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
