
import { NavLink, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { franchiseSidebarSections } from "../../utils/dashboardData";
import { clearAuthSession } from "../../utils/auth";

export default function FranchiseSidebar({ mobileOpen, onClose , franchise}) {
  const navigate = useNavigate();


  const role = localStorage.getItem("role");

  const handleLogout = () => {
    clearAuthSession();
    navigate("/", { replace: true });
    onClose?.();
  };

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`spl-dashboard-panel-soft spl-scrollbar fixed left-0 top-0 z-50 h-screen w-[260px] overflow-y-auto border-r border-white/10 transition-transform duration-300 lg:flex lg:translate-x-0 lg:flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 lg:block">
          <div>
            <div className="font-heading text-3xl tracking-[0.16em] text-green-400">
              SP<span className="text-yellow-300">L</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green-400/20 bg-green-500/10 text-lg text-green-400">
                <img src={franchise?.logo} alt="franchise-log" className="franchise-logo"/>
              </div>

              <div>
                <p className="font-condensed text-base font-bold tracking-[0.04em] text-white">
                  {franchise?.name}
                </p>
                <p className="text-xs text-slate-400">{franchise?.owner_name}</p>

                <span className="mt-1 inline-flex rounded-md bg-green-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-green-400">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Close Button (Mobile) */}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:text-red-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 px-3 py-4">
          {franchiseSidebarSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p className="px-3 pb-2 font-condensed text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/franchise-dashboard"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-green-400/10 text-green-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    <span>{item.label}</span>

                    {item.badge && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-5 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-red-400"
          >
            <span>🔓</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
