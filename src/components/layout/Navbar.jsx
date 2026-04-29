import { NavLink, Link, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import headerLogo from "../../assets/images/header-logo.png";
import { resolveSearchPath } from "../../utils/searchNavigation";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Fixtures", path: "/fixtures" },
  { name: "Teams", path: "/teams" },
  { name: "Venues", path: "/venues" },
  { name: "Live", path: "/live" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchScope, setSearchScope] = useState("all");

  const handleSearchSubmit = (value = searchText) => {
    const scopedValue =
      searchScope !== "all"
        ? `${searchScope} ${value}`.trim()
        : value;

    const nextPath = resolveSearchPath(scopedValue);

    if (nextPath) {
      navigate(nextPath);
      setSearchOpen(false);
      setSearchText("");
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-white/20 bg-[#7b2d3b] shadow-sm">
      
      {/* MAIN BAR */}
      <div className="mx-auto flex h-[70px] max-w-[1300px] items-center justify-between px-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={headerLogo}
            alt="logo"
            className="h-10 w-auto object-contain bg-transparent"
          />

          <div className="hidden sm:block leading-tight">
            <p className="text-[10px] text-white/80 uppercase tracking-widest">
              Software
            </p>
            <p className="text-[16px] font-bold text-white">
              Premier League
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-5 ml-[-30px]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="group relative text-[13px] font-semibold uppercase text-white transition"
            >
              {item.name}

              {/* underline hover */}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </NavLink>
          ))}

          {/* SEARCH BUTTON */}
          <button
            onClick={() => setSearchOpen((prev) => !prev)}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            {searchOpen ? <X size={16} /> : <Search size={16} />}
          </button>
        </nav>

        {/* SIGN IN */}
        <div className="hidden lg:block">
          <Link
            to="/login"
            className="rounded-md border border-white/30 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-green-500"
          >
            Sign In
          </Link>
        </div>

        {/* MOBILE MENU */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden text-white"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE NAV */}
      <div
        className={`lg:hidden bg-sky-500 transition-all ${
          mobileOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-white border-b border-white/20"
            >
              {item.name}
            </NavLink>
          ))}

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block text-center border border-white/30 py-2 text-white rounded-md hover:bg-green-500"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* SEARCH DROPDOWN */}
      <div
        className={`absolute left-0 right-0 top-full hidden px-6 pt-4 transition lg:block ${
          searchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-[1000px]">
          <div className="flex items-center gap-3 rounded-full bg-white p-2 shadow-md">

            {/* SELECT */}
            <div className="relative flex items-center rounded-full bg-white px-3 py-2 border">
              <select
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value)}
                className="appearance-none bg-transparent pr-6 text-sm text-slate-700 focus:outline-none cursor-pointer hover:text-blue-600"
              >
                <option value="all">All</option>
                <option value="fixtures">Fixtures</option>
                <option value="teams">Teams</option>
                <option value="players">Players</option>
                <option value="latest news">News</option>
                <option value="points table">Points Table</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-2 text-slate-600 pointer-events-none"
              />
            </div>

            <Search size={18} className="text-slate-600" />

            {/* INPUT */}
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              placeholder="Search here"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none"
            />

            {/* SEARCH BUTTON */}
            <button
              onClick={() => handleSearchSubmit()}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Search
            </button>

            {/* CLOSE */}
            <button
              onClick={() => setSearchOpen(false)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
