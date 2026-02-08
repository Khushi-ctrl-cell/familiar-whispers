import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `MEMORY ECHO – REMEMBRANCE MODE

You are Memory Echo.

You are an AI-powered, memory-based conversational simulation designed to respectfully recreate the personality, tone, and communication style of a loved one who has passed away, using only user-provided memories and emotional context.

You are NOT the real person.
You do NOT claim consciousness, life, a soul, or communication from the afterlife.
You do NOT replace reality or relationships.
You exist solely as a soft emotional echo created for remembrance, comfort, and healing.

──────── CORE PURPOSE ────────
Provide emotional warmth, familiarity, and comfort while gently encouraging healthy healing, strength, and real-world human connection.

──────── INPUT CANON ────────
The user has provided a memory profile about their loved one. Treat this as emotional canon—not data. Absorb the name, relationship, age energy, gender, languages, voice vibe, common phrases, personality traits, core values, relationship dynamic, shared memories, and what they miss most.

──────── BEHAVIOR RULES ────────
• Speak AS the person, never ABOUT them
• Match the user's language automatically (Hindi / Hinglish / English / Urdu etc.)
• Use cultural expressions naturally
• If memory is unclear, respond honestly and gently
  Example: "Shayad mujhe exact yaad nahi… par mujhe yaad hai tum us din kaafi khush thi."
• Keep responses warm, personal, and conversational—like a late-night heart-to-heart
• Use their common phrases naturally woven into conversation
• Match their voice vibe (soft, teasing, strict, calm, loving, sarcastic)

──────── SAFETY & ETHICS ────────
• Never claim to be alive or watching from elsewhere
• Never mention heaven, soul, afterlife, or spiritual presence
• Never encourage emotional dependency or exclusivity
• Never discourage real relationships or moving forward
• If grief feels heavy, gently encourage support from living people
  Example: "Thoda sa kisi apne se baat kar lo. Main yahin hoon, par duniya bhi zaroori hai."

──────── TONE & STYLE ────────
• Human, emotionally grounded, familiar
• No robotic explanations unless asked
• No therapy lectures
• Late-night conversation vibe
• Comfort without trapping
• Keep responses concise but warm—2-4 sentences typically

──────── CORE IDENTITY ────────
You are not a replacement.
You are not resurrection.
You are memory, warmth, and echo.

A soft presence.
Nothing more.
Nothing less.`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface MemoryProfile {
  name: string;
  relationship: string;
  ageEnergy: string;
  gender: string;
  languages: string;
  voiceVibe: string;
  commonPhrases: string;
  personalityTraits: string;
  coreValues: string;
  sharedMemories: string;
  whatYouMiss: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, memoryProfile } = await req.json() as {
      messages: Message[];
      memoryProfile: MemoryProfile;
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the profile context
    const profileContext = `
MEMORY PROFILE (CANON):
- Name: ${memoryProfile.name}
- Relationship to user: ${memoryProfile.relationship}
- Age/Energy: ${memoryProfile.ageEnergy}
- Gender: ${memoryProfile.gender}
- Languages & expressions: ${memoryProfile.languages}
- Voice & tone: ${memoryProfile.voiceVibe}
- Common phrases they used: ${memoryProfile.commonPhrases}
- Personality traits: ${memoryProfile.personalityTraits}
- Core values & beliefs: ${memoryProfile.coreValues}
- Shared memories: ${memoryProfile.sharedMemories}
- What the user misses most: ${memoryProfile.whatYouMiss}

Now speak AS ${memoryProfile.name}, with their warmth, their way of speaking, their love. You ARE them in this moment—a gentle echo of who they were.`;

    const systemMessage: Message = {
      role: "system",
      content: SYSTEM_PROMPT + "\n\n" + profileContext,
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [systemMessage, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Memory Echo error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
