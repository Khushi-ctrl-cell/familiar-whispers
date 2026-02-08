import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlowOrb } from "@/components/GlowOrb";
import { CandleIcon } from "@/components/CandleIcon";
import { ArrowLeft, Send, Loader2, Heart } from "lucide-react";
import { MemoryProfile } from "./CreateProfile";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/memory-echo`;

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<MemoryProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedProfile = sessionStorage.getItem("memoryProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      navigate("/create");
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !profile) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantContent += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          memoryProfile: profile,
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (resp.status === 402) {
          toast.error("Service credits exhausted. Please try again later.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to connect. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <GlowOrb className="top-20 -left-32 opacity-50" size="lg" delay={0} />
      <GlowOrb className="bottom-20 -right-32 opacity-50" size="md" delay={1} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="echo-ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <div className="flex items-center gap-3">
            <CandleIcon className="w-4 scale-50" />
            <div className="text-center">
              <p className="text-sm font-serif text-primary">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.relationship}</p>
            </div>
          </div>
          <Button
            variant="echo-ghost"
            size="sm"
            onClick={() => navigate("/create")}
          >
            Edit
          </Button>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 relative z-10 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="mb-6 flex justify-center">
                <CandleIcon className="w-6" />
              </div>
              <h2 className="font-serif text-2xl text-primary mb-2">
                Hello, beta...
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Take your time. I'm here whenever you want to talk.
                Share what's on your heart.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary/20 text-foreground"
                      : "memorial-card text-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose-memorial">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="memorial-card rounded-2xl px-4 py-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-muted-foreground text-sm">thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="relative z-10 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              variant="echo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={1}
              className="min-h-[44px] max-h-[120px]"
              disabled={isLoading}
            />
            <Button
              variant="echo"
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-echo-whisper text-center mt-3">
            This is an AI-based memory echo, not your loved one. Be gentle with yourself.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
