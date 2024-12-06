"use client";

import { useState, useEffect, useContext } from "react";
import { Search, ExternalLink, Loader2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { SearchContext } from "@/app/search-context";
interface Node{
  content:string;
  source:string;
}

interface ApiResponse {
  response: [Node];
  sources: Array<{
    score: number;
    url: string;
  }>;
}

type TabType = "earnings" | "financials" | "industry" | "market";

export default function SearchResultsPage() {
  const { currentQuery, setCurrentQuery, addSearch, getSearchResult } =
    useContext(SearchContext);
  const [searchResults, setSearchResults] = useState<ApiResponse | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>("earnings");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSearchResults = () => {
      const storedResult = localStorage.getItem("searchResults");
      if (storedResult) {
        try {
          const parsedResult: ApiResponse = JSON.parse(storedResult);
          console.log("data", parsedResult)
          setSearchResults(parsedResult);
        } catch (error) {
          console.error("Error parsing stored search result:", error);
          setSearchResults(null);
        }
      } else if (currentQuery) {
        const result = getSearchResult(currentQuery);
        if (result) {
          setSearchResults(result);
        } else {
          setSearchResults(null);
        }
      }
    };

    loadSearchResults();
  }, [currentQuery, getSearchResult]);

  const handleTabClick = (tab: TabType) => {
    setSelectedTab(tab);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentQuery.trim()) {
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
            message: currentQuery,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ApiResponse = await response.json();

      if (!data || !data.response) {
        throw new Error("Invalid response data");
      }

      setSearchResults(data);
      addSearch(currentQuery, {query:currentQuery,...data});
      localStorage.setItem("currentSearchResult", JSON.stringify(data));
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to fetch search results. Please try again.");
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 mt-3 md:mt-0">
      <div className="mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8"
        >
          <div className="relative w-full md:w-3/4 max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="What are the key financial highlights of Tesla Inc. for Q3 2024?"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
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
            className="w-full md:w-auto rounded-full px-6 py-3 font-medium text-white transition-opacity disabled:opacity-50"
            style={{
              background:
                "linear-gradient(285.8deg, #B689FF 11.03%, #00EC9D 50%, #D3FF95 88.97%)",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Search"
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="w-full max-w-3xl mx-auto mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {searchResults ? (
        <>
        <div className="grid  grid-cols-2 gap-4">
          {searchResults.response.map((content, index) => (
            <div className="bg-white  p-4 rounded-lg shadow-xl overflow-hidden border  border-[rgb(34,193,195)]" key={index}>
              <div className="">
                <div className="line-clamp-6 overflow-hidden prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="text-gray-800"
                  >
                    {content.content}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="mt-3 text-blue-500 ">
              <p className="flex gap-x-1 line-clamp-1 items-center"><Globe className="w-5 h-5"/> <a href={content.source}> {new URL(content.source).hostname.replace('www.', '')}</a></p>
              </div>
            </div>
          ))}
        </div>
          {/* <div className="mb-8 prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {searchResults.response}
            </ReactMarkdown>
          </div> */}

          <div className="grid grid-cols-1 mt-8 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button
              className={cn(
                "p-4 text-purple-500 border-2 border-purple-200 rounded-2xl transition-colors",
                selectedTab === "earnings" && "bg-purple-100"
              )}
              onClick={() => handleTabClick("earnings")}
            >
              Quarterly Earnings Call
            </button>
            <button
              className={cn(
                "p-4 text-purple-500 border-2 border-purple-200 rounded-2xl transition-colors",
                selectedTab === "financials" && "bg-purple-100"
              )}
              onClick={() => handleTabClick("financials")}
            >
              Financial Statements
            </button>
            <button
              className={cn(
                "p-4 text-purple-500 border-2 border-purple-200 rounded-2xl transition-colors",
                selectedTab === "industry" && "bg-purple-100"
              )}
              onClick={() => handleTabClick("industry")}
            >
              Industry Comparisons
            </button>
            <button
              className={cn(
                "p-4 text-purple-500 border-2 border-purple-200 rounded-2xl transition-colors",
                selectedTab === "market" && "bg-purple-100"
              )}
              onClick={() => handleTabClick("market")}
            >
              Market Performance
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.sources.map((source, index) => (
              <Card key={index} className="rounded-xl border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Source {index + 1}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Information from {new URL(source.url).hostname}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-500 hover:text-purple-700 inline-flex items-center"
                  >
                    View Source Details
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-6">
              Want More Information?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-2 rounded-full text-purple-500 border-2 border-purple-500 hover:bg-purple-50">
                Contact Support
              </button>
              <button className="px-6 py-2 rounded-full text-purple-500 border-2 border-purple-500 hover:bg-purple-50">
                Browse Documentation
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-8">
          <p className="text-xl text-gray-600">
            No search results available. Please perform a search.
          </p>
        </div>
      )}
    </div>
  );
}
