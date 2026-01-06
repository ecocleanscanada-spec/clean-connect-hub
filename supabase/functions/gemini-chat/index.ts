import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface ChatRequest {
  messages: ChatMessage[];
  userMessage: string;
  systemInstruction: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { messages, userMessage, systemInstruction }: ChatRequest = await req.json();

    // Validate input
    if (!userMessage || typeof userMessage !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid user message" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (userMessage.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 5000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing chat request with message length:", userMessage.length);

    // Build the request for Gemini API
    const contents = [
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        parts: msg.parts
      })),
      { role: "user", parts: [{ text: userMessage }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Successfully generated response");

    return new Response(
      JSON.stringify({ response: responseText }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in gemini-chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
