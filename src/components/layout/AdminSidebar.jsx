import { NavLink, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { adminSidebarSections } from "../../utils/dashboardData";

export default function AdminSidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const sidebarSections = adminSidebarSections.map((section) => {
    if (section.title !== "Management") {
      return section;
    }

    const alreadyExists = section.items.some((item) => item.path === "/admin/venues");

    if (alreadyExists) {
      return section;
    }

    const insertIndex = section.items.findIndex((item) => item.path === "/admin/players");
    const nextItems = [...section.items];

    nextItems.splice(insertIndex >= 0 ? insertIndex + 1 : nextItems.length, 0, {
      label: "Venues",
      path: "/admin/venues",
      icon: "📍",
    });

    return {
      ...section,
      items: nextItems,
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("spl_admin_logged_in");
    localStorage.removeItem("spl_user_role");
    navigate("/login");
    onClose?.();
  };

  return (
    <>
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[244px] flex-col overflow-y-auto border-r border-blue-800 bg-[#0f3b97] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:block">
          <div>
            <div className="font-heading text-[1.8rem] tracking-[0.1em] text-yellow-300">
              SP<span className="text-red-400">L</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[14px] text-white">
                ⚙️
              </div>

              <div>
                <p className="font-condensed text-[14px] font-bold tracking-[0.03em] text-white">
                  Raynx Team
                </p>
                <p className="text-[10px] text-blue-100/80">Commissioner</p>
                <span className="mt-1 inline-flex rounded-md bg-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-yellow-200">
                  Admin
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-3 py-3">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 pb-2 font-condensed text-[9px] font-bold uppercase tracking-[0.16em] text-blue-100/60">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium transition ${
                        isActive
                          ? "bg-yellow-300/15 text-yellow-200"
                          : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <span className="w-5 text-center text-[13px]">{item.icon}</span>
                    <span>{item.label}</span>

                    {item.badge ? (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[12.5px] text-blue-100/85 transition hover:text-yellow-200"
          >
            <span>🔓</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
