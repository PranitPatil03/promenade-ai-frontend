export interface SearchResult {
  query: string;
  response: string;
  sources: { score: number; url: string; }[];
} 