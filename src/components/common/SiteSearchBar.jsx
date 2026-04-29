import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ChevronDown } from "lucide-react";
import { resolveSearchPath } from "../../utils/searchNavigation";

const searchOptions = [
  "Latest News",
  "Fixtures",
  "Players",
  "Live Score",
  "Teams",
  "Points Table",
  "Top Performers",
];

export default function SiteSearchBar() {
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState("Latest News");
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    const finalText = searchText.trim() || selectedFilter;
    const resolvedPath = resolveSearchPath(finalText);

    if (!resolvedPath) {
      setError("No matching page found for your search");
      return;
    }

    setError("");
    navigate(resolvedPath);
  };

  const handleClear = () => {
    setSearchText("");
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col lg:flex-row">
          <div className="flex items-center justify-between w-full rounded-full bg-white/90 backdrop-blur-xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)] border border-white/30">
            <div className="flex w-full items-center px-5 py-4">
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full appearance-none bg-transparent pr-8 text-[14px] font-medium text-slate-600 outline-none sm:text-[15px]"
              >
                {searchOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <ChevronDown className="h-4.5 w-4.5 text-slate-500 sm:h-5 sm:w-5" />
            </div>
          </div>

          <div className="flex flex-1 items-center px-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search here"
              className="h-[66px] w-full bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
            />

            {searchText ? (
              <button
                type="button"
                onClick={handleClear}
                className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:h-10 sm:w-10"
              >
                <X className="w-4 h-4 text-bue-500" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleSearch}
              className="mr-2 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-orange-600 sm:px-7 sm:py-4 sm:text-[15px]"
            >
              <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="mt-3 px-2 text-[13px] font-medium text-red-500 sm:text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
