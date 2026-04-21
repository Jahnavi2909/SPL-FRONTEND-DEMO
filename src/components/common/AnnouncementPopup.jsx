import { useEffect, useState } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { HiOutlineMegaphone, HiOutlineSparkles } from "react-icons/hi2";

const SESSION_KEY = "announcement_popup_hidden";

export default function AnnouncementPopup({ items = [] }) {
  const [visible, setVisible] = useState(false);

  const hasItems = Array.isArray(items) && items.length > 0;

  useEffect(() => {
    const hiddenForSession = sessionStorage.getItem(SESSION_KEY);

    if (hiddenForSession || !hasItems) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [hasItems]);

  const handleCloseForSession = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setVisible(false);
  };

  if (!visible || !hasItems) {
    return null;
  }

  const item = items[0];
  const title = item.title || "Announcement";
  const detail = item.description || "No description available.";
  const meta = item.created_at
    ? new Date(item.created_at).toLocaleString("en-IN")
    : "";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_55%,#eef2ff_100%)] px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-slate-900 text-lg text-white shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                <HiOutlineMegaphone />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Announcement
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-[1.8rem]">
                  {title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseForSession}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <IoCheckmarkDone className="text-base" />
              Done
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              <HiOutlineSparkles className="text-base" />
              Update Details
            </div>

            <p className="mt-4 text-[15px] leading-7 text-slate-700 sm:text-base">
              {detail}
            </p>

            {meta ? (
              <p className="mt-4 text-sm font-medium text-slate-500">{meta}</p>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleCloseForSession}
              className="inline-flex items-center gap-2 rounded-[14px] bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <IoCheckmarkDone className="text-base" />
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
