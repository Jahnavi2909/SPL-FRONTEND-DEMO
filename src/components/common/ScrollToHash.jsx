import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // Do not auto-scroll on auth/admin pages
    const blockedRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/admin",
    ];

    const shouldSkip = blockedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (shouldSkip) {
      window.scrollTo(0, 0);
      return;
    }

    if (!location.hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const id = location.hash.replace("#", "");

    const timer = setTimeout(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  return null;
}