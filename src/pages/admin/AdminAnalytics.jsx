import StatCard from "../../components/dashboard/StatCard";
import ChartWrapper from "../../components/dashboard/ChartWrapper";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import {
  analyticsKpis,
  trafficTrendData,
  revenueBreakdownData,
  budgetUtilizationData,
  attendanceTrendData,
} from "../../utils/dashboardData";

export default function AdminAnalytics() {
  return (
    <div className="space-y-5 bg-white">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            subtext={item.subtext}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartWrapper
          title="Traffic Trend"
          type="line"
          data={trafficTrendData}
          dataKey="views"
          xKey="name"
        />

        <ChartWrapper
          title="Revenue Breakdown"
          type="pie"
          data={revenueBreakdownData}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
        <ChartWrapper
          title="Budget Utilization"
          type="bar"
          data={budgetUtilizationData}
          dataKey="amount"
          xKey="name"
        />

        <DashboardPanel title="Insights Summary">
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-[13px] font-semibold text-blue-600 sm:text-sm">
                Weekend spikes are strongest
              </p>
              <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                Traffic and engagement rise sharply during Saturday and Sunday
                live matches.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-[13px] font-semibold text-yellow-700 sm:text-sm">
                Sponsor revenue leads
              </p>
              <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                Sponsorship continues to be the biggest revenue source this
                season.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[13px] font-semibold text-emerald-600 sm:text-sm">
                Fan retention improving
              </p>
              <p className="mt-1 text-[13px] text-slate-600 sm:text-sm">
                Session duration and repeat visits are trending upward week over
                week.
              </p>
            </div>
          </div>
        </DashboardPanel>
      </section>

      <section>
        <ChartWrapper
          title="Attendance Trend"
          type="bar"
          data={attendanceTrendData}
          dataKey="fans"
          xKey="name"
        />
      </section>
    </div>
  );
}