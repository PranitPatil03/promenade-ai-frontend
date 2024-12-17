"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AiThinkingLoader } from "./AiThinkingLoader";

interface AiSummaryMarkdownProps {
  initialContent: string;
  onBack: () => void;
  nodeId: string;
  searchQuery: string;
  source: string;
}

export function AiSummaryMarkdown({
  initialContent,
  onBack,
  nodeId,
  searchQuery,
  source,
}: AiSummaryMarkdownProps) {
  const [summary, setSummary] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);

  console.log(summary)

  useEffect(() => {
    fetchInitialSummary();
  }, [initialContent, nodeId, searchQuery]);

  const fetchInitialSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            node: {
              node_id: nodeId,
              content: initialContent,
              source: source,
              doc_type: "",
            },
            search_query: searchQuery,
            chat_history: [],
            message: "Provide me its summary",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI summary");
      }

      const data = await response.json();

      const assistantContent =
        typeof data === "string" ? data : JSON.stringify(data.response);

      setSummary(assistantContent);
      setChatHistory([
        {
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (error) {
      console.error("Error fetching AI summary:", error);
      setError("Failed to fetch AI summary. Please try again.");

      // Set error in chat history
      setChatHistory([
        {
          role: "assistant",
          content: "Failed to fetch AI summary. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const updatedChatHistory = [
      ...chatHistory,
      { role: "user", content: input },
    ];

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            node: {
              node_id: nodeId,
              content: initialContent,
              source: source,
              doc_type: "",
            },
            search_query: searchQuery,
            chat_history: chatHistory,
            message: input,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();

      const assistantContent =
        typeof data === "object" && data.content
          ? data.content
          : typeof data === "string"
          ? data
          : data.response;

      setSummary(assistantContent);
      setChatHistory([
        ...updatedChatHistory,
        { role: "assistant", content: assistantContent },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setError("Failed to fetch AI response. Please try again.");

      setChatHistory([
        ...updatedChatHistory,
        {
          role: "assistant",
          content: "Failed to fetch AI response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl w-full">
      <CardHeader className="mb-2 flex flex-row items-center justify-between">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 flex items-center gap-2 text-gray-600"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <AiThinkingLoader />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="h-[calc(100vh-350px)] overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose w-full"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
