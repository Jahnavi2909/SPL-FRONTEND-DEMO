import SectionHeader from "../common/SectionHeader";
import SponsorCard from "./SponsorCard";
import useSponsors from "../../hooks/useSponsors";
import { getMediaUrl } from "../../utils/media";

const SPONSOR_ACCENTS = [
  "from-[#7b2d3b] via-[#9b4251] to-[#d08956]",
  "from-[#123c73] via-[#1f6ea2] to-[#4fb0d1]",
  "from-[#0d5c63] via-[#169873] to-[#7bc47f]",
  "from-slate-900 via-slate-700 to-slate-500",
];

function mapSponsor(item, index) {
  return {
    id: item.id,
    name: item.sponsor_name || item.name || "Unnamed Sponsor",
    category:
      item.sponsorship_type ||
      item.category ||
      item.sponsor_type ||
      "Official Sponsor",
    sponsoredFor:
      item.sponsored_for ||
      item.description ||
      "Supporting the Software Premier League ecosystem with league-facing brand partnership.",
    website: item.website || "",
    contactEmail: item.contact_email || "",
    logo: item.logo ? getMediaUrl(item.logo) : "",
    accent: SPONSOR_ACCENTS[index % SPONSOR_ACCENTS.length],
  };
}

export default function SponsorsSection() {
  const { sponsors, loading, error } = useSponsors();
  const mappedSponsors = sponsors.map((item, index) => mapSponsor(item, index));

  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 xl:px-10">
      <SectionHeader
        title=""
        highlight="SPONSORS"
        darkMode={false}
        align="center"
        eyebrow="Brand Partners"
        description="A premium partner showcase with logo-led rows, cleaner spacing, and a full-detail experience on click."
      />

      {loading ? (
        <div className="mt-10 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[180px] animate-pulse rounded-[30px] border border-[#7b2d3b]/10 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-10 rounded-[30px] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      ) : mappedSponsors.length === 0 ? (
        <div className="mt-10 rounded-[30px] border border-[#7b2d3b]/10 bg-white p-6 text-center text-sm text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
          No sponsors available right now.
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {mappedSponsors.map((sponsor, index) => (
            <SponsorCard
              key={sponsor.id}
              id={sponsor.id}
              index={index}
              name={sponsor.name}
              category={sponsor.category}
              sponsoredFor={sponsor.sponsoredFor}
              logo={sponsor.logo}
              website={sponsor.website}
              accent={sponsor.accent}
            />
          ))}
        </div>
      )}
    </section>
  );
}
