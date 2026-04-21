// components/franchise/FranchiseTopbar.jsx
import { Menu, Bell, Send, Search } from "lucide-react";

export default function FranchiseTopbar({
  title = "FRANCHISE DASHBOARD",
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 md:px-6 lg:ml-[260px]">
      
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-700 transition hover:text-blue-600 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="truncate font-semibold text-xl tracking-wide text-gray-900 sm:text-2xl md:text-3xl">
        {title}
      </h1>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">

        {/* Search */}
        <div className="hidden h-10 items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3 md:flex">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search players, squad..."
            className="w-44 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-600 transition hover:text-blue-600"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Actions */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-gray-600 transition hover:text-blue-600"
        >
          <Send size={18} />
        </button>

        {/* Profile */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-3 py-1">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            F
          </div>
          <span className="text-sm text-gray-900">Franchise</span>
        </div>

      </div>
    </header>
  );
}