"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import SearchV1 from "@/public/icons/Search-var1.png";
import SearchV2 from "@/public/icons/Search-var2.png";
import SearchV3 from "@/public/icons/Search-var3.png";
import SearchV4 from "@/public/icons/Search-var4.png";

interface LoadingIndicatorProps {
  companyName: string;
  onBack: () => void;
}

export const loadingMessages = [
  "Searching for IR Pages",
  "Searching for SEC Filings",
  "Searching for Industry Reports",
  "Processing the collected pages",
  "Identifying important info",
  "Extracting snippets",
  "Highlighting the key points",
  "Parsing the response",
];

function useLoadingIndicator() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [ellipsis, setEllipsis] = useState("");

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(
        (prevIndex) => (prevIndex + 1) % loadingMessages.length
      );
    }, Math.random() * (10000 - 5000) + 5000); // Random interval between 5-10 seconds

    const ellipsisInterval = setInterval(() => {
      setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 300); // Update ellipsis every 300ms for a smoother animation

    // Uncomment this block if you want to automatically hide the loading indicator after some time
    // const loadingTimeout = setTimeout(() => {
    //   setIsLoading(false)
    // }, Math.random() * (120000 - 90000) + 90000) // Random time between 1.5-2 minutes

    return () => {
      clearInterval(messageInterval);
      clearInterval(ellipsisInterval);
      // clearTimeout(loadingTimeout)
    };
  }, []);

  return {
    currentMessage: loadingMessages[currentMessageIndex],
    ellipsis,
    isLoading: true
  };
}

export function LoadingIndicator({
  companyName,
  onBack,
}: LoadingIndicatorProps) {
  const { currentMessage, ellipsis, isLoading } = useLoadingIndicator();
  const images = [SearchV1, SearchV2, SearchV3, SearchV4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!isLoading) return null;

  return (
      <div className="bg-white rounded-2xl w-full max-w-[560px] p-12 text-center shadow-lg border">
        <div className="w-16 h-16 mx-auto mb-6">
          <Image
            src={images[currentImageIndex]}
            alt="Loading animation"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h2 className="text-[22px] font-semibold text-gray-900 mb-1">
          Fetching &quot;{companyName}&quot;
        </h2>

        <p className="text-base text-gray-600 mb-3">
          {currentMessage}
          <span className="inline-block w-6 text-left">{ellipsis}</span>
        </p>

        <div className="flex gap-2 justify-center mb-6">
          <div className="w-2 h-2 rounded-full bg-[#7F56D9] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#7F56D9] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#7F56D9] animate-bounce" />
        </div>

        <p className="text-sm text-gray-600 mb-8 max-w-[400px] mx-auto">
          This process might take some time, but the wait will be worth it! You
          can close this window or make another request. We&apos;ll email you
          once the results are ready.
        </p>

        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#7F56D9] hover:bg-[#6941C6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
  );
}