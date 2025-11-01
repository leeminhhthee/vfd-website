"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Loader, AlertCircle } from "lucide-react"

interface SearchResult {
  id: number
  title: string
  excerpt: string
  type: "news" | "document" | "project"
  date: string
  relevance: number
}

export default function SmartSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Mock AI suggestions
  const allSuggestions = [
    "Giải bóng chuyền nam",
    "Đăng ký giải đấu",
    "Lịch thi đấu",
    "Quy định tham gia",
    "Đội tuyển Đà Nẵng",
    "Huấn luyện viên",
    "Vận động viên",
  ]

  // Handle autocomplete
  useEffect(() => {
    if (query.length > 0) {
      const filtered = allSuggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 1,
      title: "Giải vô địch bóng chuyền TP Đà Nẵng 2024",
      excerpt: "Kết quả chung kết giải vô địch bóng chuyền TP Đà Nẵng năm 2024...",
      type: "news",
      date: "2024-10-25",
      relevance: 0.95,
    },
    {
      id: 2,
      title: "Quy định tham gia giải đấu 2024",
      excerpt: "Các quy định chi tiết về cách thức tham gia các giải đấu...",
      type: "document",
      date: "2024-10-01",
      relevance: 0.87,
    },
    {
      id: 3,
      title: "Dự án phát triển bóng chuyền trẻ",
      excerpt: "Chương trình phát triển tài năng bóng chuyền cho các vận động viên trẻ tuổi",
      type: "project",
      date: "2024-10-01",
      relevance: 0.78,
    },
  ]

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    setShowSuggestions(false)

    // Simulate AI search delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Filter mock results based on query
    const filtered = mockResults.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setResults(filtered)
    setLoading(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    handleSearch(suggestion)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-muted-foreground" size={24} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tin tức, tài liệu, dự án..."
            className="w-full pl-14 pr-4 py-4 text-lg border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                >
                  <Search size={16} className="inline mr-2 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader size={32} className="text-primary animate-spin" />
          <span className="ml-3 text-lg text-muted-foreground">Đang tìm kiếm...</span>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tìm thấy <span className="font-bold text-foreground">{results.length}</span> kết quả
          </p>

          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{result.title}</h3>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        result.type === "news"
                          ? "bg-blue-100 text-blue-700"
                          : result.type === "document"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {result.type === "news" ? "Tin tức" : result.type === "document" ? "Tài liệu" : "Dự án"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(result.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Độ phù hợp</p>
                  <p className="text-lg font-bold text-accent">{Math.round(result.relevance * 100)}%</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{result.excerpt}</p>

              <button className="text-accent font-bold hover:text-accent-light transition-colors">
                Xem chi tiết →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">Không tìm thấy kết quả nào cho "{query}"</p>
          <p className="text-sm text-muted-foreground mt-2">Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Popular Searches */}
      {!query && results.length === 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Tìm kiếm phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-4 bg-muted rounded-lg hover:bg-border transition-colors text-left"
              >
                <Search size={18} className="text-accent mb-2" />
                <p className="font-medium text-foreground">{suggestion}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
