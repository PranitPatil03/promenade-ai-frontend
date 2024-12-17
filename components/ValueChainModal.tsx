"use client";

import { useState } from "react";
import { GitBranch, X, Info } from "lucide-react";

interface ValueChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { industry: string }) => void;
}

export function ValueChainModal({
  isOpen,
  onClose,
  onSubmit,
}: ValueChainModalProps) {
  const [industry, setIndustry] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ industry });
  };

  return (
    <div className=" relative inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="w-full max-w-[580px] mx-auto bg-white rounded-2xl shadow-xl border">
        <div className="flex items-center gap-3 py-3 px-5 border-b">
          <div className="p-2 border rounded-lg">
            <GitBranch className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-medium">Value Chain</h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-4 p-1 text-gray-500 hover:text-gray-700 bg-[#F3F4F6] rounded-full"
            style={{ boxShadow: "0px 0.89px 1.78px 0px #1018280D" }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="industry"
              className="block text-sm font-medium text-gray-700"
            >
              Industry
            </label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Enter industry name"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </form>

        <div className="border-t p-6 flex items-center justify-between bg-gray-50 rounded-b-2xl gap-1">
          <div className="flex items-center gap-1 text-sm text-[#4B5563]">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-[#6B7280]">To perform this action</span>
            <span className="font-medium text-[#111827]">03 credits</span>
            <span className="text-[#6B7280]">will be deducted</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#FFFFFF] rounded-lg border bg-[#FFFFFF] border-[#D2D6DB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-[#7F56D9] rounded-lg hover:bg-[#6941C6]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
