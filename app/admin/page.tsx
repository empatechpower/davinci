import StatsCard from "@/components/admin/StatsCard";
import Link from "next/link";
import { query, queryOne } from "@/lib/db";
import type { Order } from "@/lib/db/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default async function AdminDashboardPage() {
  const [artistCount, artworkCount, orders] = await Promise.all([
    queryOne<{ c: number }>("SELECT COUNT(*) AS c FROM artists"),
    queryOne<{ c: number }>("SELECT COUNT(*) AS c FROM artworks"),
    query<Order>(
      "SELECT id, order_number, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5"
    ),
  ]);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);

  const overviewStats = [
    { label: "Total Artists",  value: String(artistCount?.c  ?? 0) },
    { label: "Total Artworks", value: String(artworkCount?.c ?? 0) },
    { label: "Total Sales",    value: `$${totalSales.toLocaleString()}` },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Overview */}
      <div>
        <h2 className="text-[20px] font-bold text-ad-dark mb-5">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {overviewStats.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Orders",   href: "/admin/orders"   },
          { label: "Manage Events",   href: "/admin/events"   },
          { label: "View Artists",    href: "/admin/artists"  },
          { label: "View Artworks",   href: "/admin/artworks" },
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

      {/* Recent orders */}
      <div className="bg-white border border-ad-border rounded-[16px] overflow-hidden">
        <div className="px-6 py-4 border-b border-ad-border flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-ad-dark">Recent Orders</h3>
          <Link href="/admin/orders" className="text-[14px] text-ad-purple hover:underline">
            View all
          </Link>
        </div>
        {!orders || orders.length === 0 ? (
          <p className="px-6 py-10 text-center text-[14px] text-ad-gray">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-ad-border-light">
                <tr>
                  {["Order", "Customer", "Total", "Status", "Date"].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[12px] font-semibold text-ad-gray">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-ad-border-light last:border-none hover:bg-gray-50">
                    <td className="px-4 py-3 text-[13px] font-medium text-ad-dark">{order.order_number}</td>
                    <td className="px-4 py-3 text-[13px] text-ad-gray">{order.customer_name}</td>
                    <td className="px-4 py-3 text-[13px] text-ad-dark font-medium">
                      ${Number(order.total ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[12px] px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? ""}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ad-gray">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
