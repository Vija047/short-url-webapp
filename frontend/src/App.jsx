import React, { useState } from "react";
import { Link, BarChart3, Copy, ExternalLink } from "lucide-react";

export default function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");
    setStats(null);

    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(
        "https://short-url-webapp-bj5nd.vercel.app/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ longUrl }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);
      const shortCode = data.shortUrl.split("/").pop();
      setCode(shortCode);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to connect to the server");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://short-url-webapp-blond.vercel.app/stats/${code}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message || "Stats fetch failed");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-full">
              <Link className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-600">
            Transform your long URLs into short, shareable links
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="url-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter your long URL
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/very-long-url..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Link className="w-5 h-5" />
              <span>Shorten URL</span>
            </button>
          </div>

          {/* Success Result */}
          {shortUrl && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                URL Shortened Successfully!
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Your short URL:
                  </label>
                  <div className="flex items-center space-x-2 p-3 bg-white border border-green-300 rounded-lg">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-blue-600 hover:text-blue-800 truncate font-medium"
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  {copied && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>

                <button
                  onClick={fetchStats}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-gray-900">Analytics</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Original URL
                </h4>
                <p className="text-sm text-gray-600 break-all">
                  {stats.longUrl}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  Created Date
                </h4>
                <p className="text-sm text-gray-600">
                  {new Date(stats.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg md:col-span-2">
                <h4 className="font-semibold text-indigo-700 mb-2">
                  Total Visits
                </h4>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.visitCount}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-red-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="ml-3 text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
