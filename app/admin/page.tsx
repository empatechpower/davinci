import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";

const OVERVIEW_STATS = [
  { label: "Total Artists", value: "25" },
  { label: "Total Artworks", value: "156" },
  { label: "Total Sales", value: "$50,240" },
];

const RECENT_ORDERS = [
  { id: "ORD-2024-001", customer: "Sarah Johnson", total: "$830.00", status: "new", date: "2024-11-13" },
  { id: "ORD-2024-002", customer: "Michael Brown", total: "$560.00", status: "processing", date: "2024-11-12" },
  { id: "ORD-2024-003", customer: "Emily Davis", total: "$520.00", status: "shipped", date: "2024-11-10" },
  { id: "ORD-2024-004", customer: "David Wilson", total: "$340.00", status: "delivered", date: "2024-11-08" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Overview */}
      <div>
        <h2 className="text-[20px] font-bold text-ad-dark mb-5">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {OVERVIEW_STATS.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Orders", href: "/admin/orders" },
          { label: "Manage Events", href: "/admin/events" },
          { label: "View Artists", href: "/admin/artists" },
          { label: "View Artworks", href: "/admin/artworks" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-ad-border rounded-[12px] px-4 py-4 text-[14px] font-medium text-ad-dark hover:border-ad-purple hover:text-ad-purple transition-colors text-center"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Recent orders preview */}
      <div className="bg-white border border-ad-border rounded-[16px] overflow-hidden">
        <div className="px-6 py-4 border-b border-ad-border flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-ad-dark">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-[14px] text-ad-purple hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-ad-border-light">
              <tr>
                {["Order", "Customer", "Total", "Status", "Date"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-[12px] font-semibold text-ad-gray"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-ad-border-light last:border-none hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-[13px] font-medium text-ad-dark">
                    {order.id}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ad-gray">
                    {order.customer}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ad-dark font-medium">
                    {order.total}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[12px] px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-ad-gray">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
