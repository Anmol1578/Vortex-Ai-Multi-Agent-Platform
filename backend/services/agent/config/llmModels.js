import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenRouter } from "@langchain/openrouter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY");
}

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY");
}

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY");
}

/*
|--------------------------------------------------------------------------
| GROQ
|--------------------------------------------------------------------------
| Use the 120B model only where you actually need strong reasoning.
|
*/

const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: 1200,
});

/*
|--------------------------------------------------------------------------
| GEMINI
|--------------------------------------------------------------------------
| Vision + fallback
|--------------------------------------------------------------------------
*/

const gemini = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3.6-flash",
  temperature: 0,
  maxOutputTokens: 2000,
});

/*
| OPENROUTER

| Primary coding model
*/

const openrouter = new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 6000,
});

/*
| MODEL ROUTER
*/

export const getModel = (agent) => {
  switch (agent) {
    /*
    | Router / Intent
    | Keep this very small because routing doesn't need a long response.
    */
    case "router":
    case "intent":
      return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "openai/gpt-oss-120b",
        temperature: 0,
        maxTokens: 200,
      });

    /*
    | Normal Chat
    */

    case "chat":
      return groq;

    /*
    | Search
    */

    case "search":
      return groq;

    /*
    | Coding
    */

    case "coding":
      return openrouter;

    case "codingFallback":
      return gemini;

    /*
    | PDF / PPT
    */

    case "pdf":
    case "ppt":
      return groq;

    /*
    | Vision
    */

    case "image":
    case "vision":
    case "gemini":
    case "imageAnalyzer":
      return gemini;

    default:
      return groq;
  }
};
