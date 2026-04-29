
import { Link, useSearchParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import TeamsGrid from "../../components/team/TeamsGrid";
import useTeams from "../../hooks/useTeams";

function getShortName(teamName = "", shortName = "") {
  return (
    shortName ||
    String(teamName)
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 3)
      .toUpperCase()
  );
}

function getFallbackColor(primaryColor = "") {
  const colorMap = {
    orange: "#F97316",
    black: "#111827",
    pink: "#EC4899",
    blue: "#2563EB",
    red: "#DC2626",
    gold: "#EAB308",
    yellow: "#EAB308",
    darkblue: "#1E3A8A",
    drakblue: "#1E3A8A",
    brijal: "#7C3AED",
  };

  return colorMap[String(primaryColor).toLowerCase()] || "#334155";
}

function getTeamFranchiseId(team = {}) {
  if (team.franchise && typeof team.franchise === "object") {
    return String(team.franchise.id || "");
  }

  return String(team.franchise ?? team.franchise_id ?? "");
}

export default function TeamsPage() {
  const [searchParams] = useSearchParams();
  const selectedFranchiseId = searchParams.get("franchise");
  const selectedFranchiseName = searchParams.get("name") || "Selected Franchise";
  const { teams, loading, error } = useTeams();


  const pageError = error;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-5 lg:px-6 xl:px-8">
          <SectionHeader title="SPL" highlight="TEAMS" darkMode={false} />

          <p className="max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
            {selectedFranchiseId
              ? `Showing approved teams for ${selectedFranchiseName}.`
              : "Explore approved teams, captain details, head coach, home city, and official team identity in a clean responsive layout."}
          </p>

          {selectedFranchiseId ? (
            <div className="mt-5">
              <Link
                to="/franchises"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#7b2d3b]"
              >
                All Franchises
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-5 lg:px-6 xl:px-8">
        {loading ? (
          <div className="py-16 text-center text-slate-500">Loading teams...</div>
        ) : pageError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {pageError}
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
            {selectedFranchiseId
              ? "No approved teams found for this franchise."
              : "No approved teams found."}
          </div>
        ) : (
          <TeamsGrid teams={teams} />
        )}
      </section>
    </div>
  );
}
