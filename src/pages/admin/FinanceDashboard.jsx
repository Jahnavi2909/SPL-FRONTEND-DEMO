import { useMemo, useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import DashboardPanel from "../../components/dashboard/DashboardPanel";
import DataTable from "../../components/dashboard/DataTable";
import FilterBar from "../../components/dashboard/FilterBar";
import ChartWrapper from "../../components/dashboard/ChartWrapper";
import ExportButton from "../../components/dashboard/ExportButton";
import Badge from "../../components/common/Badge";
import {
  financeSummaryCards,
  invoiceTableData,
  financeRevenueBreakdown,
  settlementWidgets,
} from "../../utils/dashboardData";

export default function FinanceDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredInvoices = useMemo(() => {
    return invoiceTableData.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        invoice.party.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || invoice.status === filters.status;

      const matchesCategory =
        filters.category === "all" || invoice.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [filters]);

  const columns = [
    { key: "id", label: "Invoice ID" },
    { key: "party", label: "Party" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount" },
    { key: "dueDate", label: "Due Date" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const colorMap = {
          Paid: "green",
          Pending: "yellow",
          Overdue: "red",
        };

        return <Badge label={row.status} color={colorMap[row.status]} />;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-200"
          >
            View
          </button>
          <button
            type="button"
            className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-200"
          >
            Mark Paid
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 bg-white">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {financeSummaryCards.map((item) => (
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

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ChartWrapper
          title="Revenue Breakdown"
          type="pie"
          data={financeRevenueBreakdown}
        />

        <DashboardPanel title="Settlement Widgets">
          <div className="space-y-4">
            {settlementWidgets.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{item.note}</p>
                  </div>

                  <span className="text-lg">{item.icon}</span>
                </div>

                <p className="mt-4 font-heading text-3xl text-yellow-700">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <FilterBar
        filters={[
          {
            key: "search",
            label: "Search Invoice",
            type: "text",
            value: filters.search,
            placeholder: "Search by invoice id or party",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            value: filters.status,
            options: [
              { label: "All Status", value: "all" },
              { label: "Paid", value: "Paid" },
              { label: "Pending", value: "Pending" },
              { label: "Overdue", value: "Overdue" },
            ],
          },
          {
            key: "category",
            label: "Category",
            type: "select",
            value: filters.category,
            options: [
              { label: "All Categories", value: "all" },
              { label: "Sponsorship", value: "Sponsorship" },
              { label: "Venue", value: "Venue" },
              { label: "Operations", value: "Operations" },
              { label: "Merchandise", value: "Merchandise" },
              { label: "Media", value: "Media" },
            ],
          },
        ]}
        onChange={handleFilterChange}
      />

      <DashboardPanel title="Invoice Registry" bodyClassName="space-y-4">
        <div className="flex justify-end">
          <ExportButton
            label="Export Invoices"
            onClick={() => console.log("export invoices")}
          />
        </div>

        <DataTable columns={columns} data={filteredInvoices} rowKey="id" />
      </DashboardPanel>
    </div>
  );
}