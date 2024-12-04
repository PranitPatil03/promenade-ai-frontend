"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiResponse {
  response: string;
  sources: Array<{
    score: number;
    url: string;
  }>;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<"sec" | "all">("all");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

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
            message: searchQuery,
            mode: searchMode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ApiResponse = await response.json();
      localStorage.setItem("searchResults", JSON.stringify(data));
      localStorage.setItem("lastSearchQuery", searchQuery);
      router.push("/search");
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
          <span
            style={{
              background: "linear-gradient(to right, #00ffcc, #00ccff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Search
          </span>
          <span className="text-[#301111]">for any topics</span>
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex items-center justify-center gap-4 mt-8"
        >
          <div className="relative w-3/4 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full focus:outline-none text-gray-700 placeholder-gray-500"
              style={{
                border: "1.5px solid transparent",
                borderRadius: "9999px",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(299.73deg, #B689FF 18.18%, #00EC9D 100.4%, #B588FE 210.75%, #D3FF95 297.18%)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full px-6 py-3 font-medium text-white transition-opacity disabled:opacity-50"
            style={{
              background:
                "linear-gradient(285.8deg, #B689FF 11.03%, #00EC9D 50%, #D3FF95 88.97%)",
            }}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <span
                style={{
                  background:
                    "linear-gradient(0deg, #301111, #301111), linear-gradient(299.73deg, #B689FF 18.18%, #00EC9D 100.4%, #B588FE 210.75%, #D3FF95 297.18%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Search
              </span>
            )}
          </button>
        </form>

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className={cn(
              "px-6 py-2 rounded-full transition-colors",
              searchMode === "sec"
                ? "bg-purple-500 text-white"
                : "text-purple-500 hover:bg-purple-50"
            )}
            onClick={() => setSearchMode("sec")}
          >
            SEC Filing & IR Presentation only
          </button>
          <button
            type="button"
            className={cn(
              "px-6 py-2 rounded-full transition-colors",
              searchMode === "all"
                ? "bg-purple-500 text-white"
                : "text-purple-500 hover:bg-purple-50"
            )}
            onClick={() => setSearchMode("all")}
          >
            All sources including web
          </button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full relative mb-4 w-full max-w-3xl"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}