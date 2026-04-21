import { useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import FilterBar from "../../components/dashboard/FilterBar";
import ExportButton from "../../components/dashboard/ExportButton";
import Badge from "../../components/common/Badge";
import { approvalSummaryCards, approvalsData } from "../../utils/dashboardData";

function getApprovalIcon(icon) {
  switch (icon) {
    case "Pending":
      return <FaClock />;
    case "Approved":
      return <FaCheckCircle />;
    case "Rejected":
      return <FaTimesCircle />;
    case "Escalated":
      return <FaExclamationTriangle />;
    default:
      return <FaClock />;
  }
}

function ApprovalStatCard({ label, value, subtext, color, icon }) {
  const topBorderMap = {
    gold: "before:bg-yellow-500",
    red: "before:bg-red-500",
    green: "before:bg-emerald-500",
    blue: "before:bg-blue-500",
    purple: "before:bg-purple-500",
    orange: "before:bg-orange-500",
  };

  const valueColorMap = {
    gold: "text-yellow-600",
    red: "text-red-500",
    green: "text-emerald-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[2.5px] ${topBorderMap[color]}`}
    >
      <p className="font-condensed text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div>
          <h3
            className={`font-heading text-[1.8rem] leading-none tracking-[0.03em] sm:text-[2rem] ${valueColorMap[color]}`}
          >
            {value}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">{subtext}</p>
        </div>

        <span className="text-[1.35rem] text-slate-400 sm:text-[1.5rem]">
          {getApprovalIcon(icon)}
        </span>
      </div>
    </div>
  );
}

export default function AdminApprovalsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredApprovals = useMemo(() => {
    return approvalsData.filter((item) => {
      const searchText = filters.search.toLowerCase();

      const matchesSearch =
        item.requestType.toLowerCase().includes(searchText) ||
        item.subject.toLowerCase().includes(searchText) ||
        item.id.toLowerCase().includes(searchText);

      const matchesStatus =
        filters.status === "all" || item.status === filters.status;

      const matchesPriority =
        filters.priority === "all" || item.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [filters]);

  const columns = [
    { key: "id", label: "Approval ID" },
    { key: "requestType", label: "Request Type" },
    { key: "requestedBy", label: "Requested By" },
    { key: "subject", label: "Subject" },
    { key: "date", label: "Date" },
    {
      key: "priority",
      label: "Priority",
      render: (row) => {
        const colorMap = {
          High: "red",
          Medium: "orange",
          Low: "blue",
        };

        return <Badge label={row.priority} color={colorMap[row.priority]} />;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const colorMap = {
          Pending: "purple",
          Approved: "green",
          Rejected: "red",
        };

        return <Badge label={row.status} color={colorMap[row.status]} />;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-200"
          >
            <FaEye size={10} />
            View
          </button>

          {row.status === "Pending" ? (
            <>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 transition hover:bg-emerald-200"
              >
                <FaCheck size={10} />
                Approve
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-semibold text-red-600 transition hover:bg-red-200"
              >
                <FaTimes size={10} />
                Reject
              </button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 bg-white">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {approvalSummaryCards.map((item) => (
          <ApprovalStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            subtext={item.subtext}
            color={item.color}
            icon={item.icon}
          />
        ))}
      </section>

      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Approval",
            type: "text",
            value: filters.search,
            placeholder: "Search by id, request, or subject",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ],
          },
          {
            key: "priority",
            label: "Priority",
            type: "select",
            value: filters.priority,
            options: [
              { label: "All Priority", value: "all" },
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ],
          },
        ]}
        onChange={handleFilterChange}
      />

      <DashboardPanel title="Approval Queue" bodyClassName="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="text-[13px] text-slate-500 sm:text-sm">
            Total results:{" "}
            <span className="font-semibold text-slate-900">
              {filteredApprovals.length}
            </span>
          </div>

          <div className="flex gap-3">
            <ExportButton
              label="Export Approvals"
              onClick={() => console.log("export approvals")}
            />
          </div>
        </div>

        <DataTable columns={columns} data={filteredApprovals} rowKey="id" />
      </DashboardPanel>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardPanel title="Urgent Pending Approvals">
          <div className="space-y-3">
            {filteredApprovals
              .filter(
                (item) =>
                  item.priority === "High" && item.status === "Pending"
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-red-200 bg-red-50 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                      {item.subject}
                    </p>
                    <Badge label={item.priority} color="red" />
                  </div>

                  <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">
                    {item.requestedBy} · {item.date}
                  </p>
                </div>
              ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Approval Notes">
          <div className="space-y-3">
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
              <p className="text-[13px] font-semibold text-purple-600 sm:text-sm">
                Pending registration approvals
              </p>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">
                Verify player documents before final approval.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-[13px] font-semibold text-emerald-600 sm:text-sm">
                Approved requests synced
              </p>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">
                Recently approved requests will reflect in next dashboard cycle.
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-[13px] font-semibold text-yellow-700 sm:text-sm">
                Escalation watch
              </p>
              <p className="mt-1 text-[12px] text-slate-600 sm:text-[13px]">
                High-priority approvals should be reviewed before matchday.
              </p>
            </div>
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}