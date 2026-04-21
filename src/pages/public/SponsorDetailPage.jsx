import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  HiArrowLeft,
  HiEnvelope,
  HiGlobeAlt,
  HiInformationCircle,
  HiOutlineSparkles,
  HiTag,
} from "react-icons/hi2";
import SectionHeader from "../../components/common/SectionHeader";
import useSponsors from "../../hooks/useSponsors";
import { getMediaUrl } from "../../utils/media";

function mapSponsor(item) {
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
      "Supporting the Software Premier League with brand presence, visibility, and match-day engagement.",
    description:
      item.description ||
      "This sponsor is part of the SPL public partnership lineup and will support selected league experiences as the platform grows.",
    website: item.website || "",
    contactEmail: item.contact_email || "",
    logo: item.logo ? getMediaUrl(item.logo) : "",
  };
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#7b2d3b]/70">
        <Icon className="text-base" />
        {label}
      </div>
      <div className="mt-4 text-[15px] leading-7 text-slate-700">{children}</div>
    </div>
  );
}

export default function SponsorDetailPage() {
  const { sponsorId } = useParams();
  const { sponsors, loading, error } = useSponsors();

  const sponsor = useMemo(() => {
    const match = sponsors.find((item) => String(item.id) === String(sponsorId));
    return match ? mapSponsor(match) : null;
  }, [sponsorId, sponsors]);

  const headerBlock = (
    <section className="border-b border-[#7b2d3b]/10 bg-[radial-gradient(circle_at_top_left,rgba(123,45,59,0.10),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(255,247,236,0.96)_100%)]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 xl:px-10">
        <SectionHeader
          title="SPONSOR"
          highlight="DETAILS"
          darkMode={false}
          align="center"
          eyebrow="Partnership Profile"
          description="A full-detail sponsor view designed to feel cleaner, more premium, and closer to a real production sports property."
        />
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_42%,#fff6ec_100%)] text-slate-900">
        {headerBlock}
        <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[32px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            Loading sponsor details...
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_42%,#fff6ec_100%)] text-slate-900">
        {headerBlock}
        <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[32px] border border-red-200 bg-red-50 p-8 text-center text-red-600">
            {error}
          </div>
        </section>
      </div>
    );
  }

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_42%,#fff6ec_100%)] text-slate-900">
        {headerBlock}
        <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
          <div className="rounded-[32px] border border-[#7b2d3b]/10 bg-white p-8 text-center text-slate-500 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
            Sponsor not found.
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_42%,#fff6ec_100%)] text-slate-900">
      {headerBlock}

      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="overflow-hidden rounded-[36px] border border-[#7b2d3b]/10 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#5a1926_0%,#7b2d3b_42%,#ab5360_100%)] px-6 py-10 text-white sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,214,152,0.24),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:h-32 sm:w-32">
                {sponsor.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-3xl font-bold tracking-[0.16em]">
                    {sponsor.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Official Partner Spotlight
              </p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-[2.5rem]">
                {sponsor.name}
              </h1>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe9be]">
                  <HiTag className="text-sm" />
                  {sponsor.category}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  <HiOutlineSparkles className="text-sm text-[#ffe9be]" />
                  Premium detail view
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-2">
            <InfoCard icon={HiInformationCircle} label="Partnership Summary">
              {sponsor.sponsoredFor}
            </InfoCard>

            <InfoCard icon={HiInformationCircle} label="Sponsor Overview">
              {sponsor.description}
            </InfoCard>

            <InfoCard icon={HiGlobeAlt} label="Website">
              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#7b2d3b] transition hover:text-[#9b4251]"
                >
                  {sponsor.website}
                </a>
              ) : (
                <span className="font-medium text-slate-900">Not available</span>
              )}
            </InfoCard>

            <InfoCard icon={HiEnvelope} label="Contact">
              {sponsor.contactEmail ? (
                <a
                  href={`mailto:${sponsor.contactEmail}`}
                  className="font-semibold text-[#7b2d3b] transition hover:text-[#9b4251]"
                >
                  {sponsor.contactEmail}
                </a>
              ) : (
                <span className="font-medium text-slate-900">
                  Contact details will be added soon.
                </span>
              )}
            </InfoCard>
          </div>

          <div className="border-t border-slate-200 px-6 py-5 sm:px-8">
            <Link
              to="/#sponsors"
              className="inline-flex items-center gap-2 rounded-full border border-[#7b2d3b]/15 bg-[#fff7ed] px-5 py-3 text-sm font-semibold text-[#7b2d3b] transition hover:border-[#7b2d3b]/30 hover:bg-white"
            >
              <HiArrowLeft className="text-base" />
              Back To Sponsors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
