"use client";

import { useState, useEffect } from "react";
import { Search, X, Eye, Clock, Package, Truck, CheckCircle, XCircle, Filter, Loader2 } from "lucide-react";
import type { Order, OrderItem } from "@/lib/db/types";

const STATUS_OPTIONS = ["All Status", "New Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE: Record<string, { pill: string; label: string }> = {
  new:        { pill: "bg-blue-100 text-blue-700 border border-blue-200",     label: "New"        },
  processing: { pill: "bg-yellow-100 text-yellow-700 border border-yellow-200", label: "Processing" },
  shipped:    { pill: "bg-purple-100 text-purple-700 border border-purple-200", label: "Shipped"    },
  delivered:  { pill: "bg-green-100 text-green-700 border border-green-200",   label: "Delivered"  },
  cancelled:  { pill: "bg-red-100 text-red-700 border border-red-200",         label: "Cancelled"  },
};

const ORDER_STATUS_BUTTONS = [
  { key: "new",        label: "New",        Icon: Clock        },
  { key: "processing", label: "Processing", Icon: Package      },
  { key: "shipped",    label: "Shipped",    Icon: Truck        },
  { key: "delivered",  label: "Delivered",  Icon: CheckCircle  },
  { key: "cancelled",  label: "Cancelled",  Icon: XCircle      },
] as const;

const STAT_DEFS = [
  { label: "Total Orders",  key: "all",        bg: "bg-white",       border: "border-ad-border"    },
  { label: "New Orders",    key: "new",        bg: "bg-blue-50",     border: "border-blue-200"     },
  { label: "Processing",    key: "processing", bg: "bg-yellow-50",   border: "border-yellow-200"   },
  { label: "Shipped",       key: "shipped",    bg: "bg-purple-50",   border: "border-purple-200"   },
  { label: "Delivered",     key: "delivered",  bg: "bg-green-50",    border: "border-green-200"    },
] as const;

function filterKey(statusFilter: string): string {
  if (statusFilter === "All Status") return "all";
  return statusFilter.toLowerCase().replace(" orders", "");
}

export default function OrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [lineItems, setLineItems]         = useState<OrderItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("new");
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  async function openOrder(order: Order) {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    // order_items are included in the admin/orders response
    const withItems = orders.find((o) => o.id === order.id) as Order & { order_items?: OrderItem[] };
    setLineItems(withItems?.order_items ?? []);
  }

  async function handleSaveStatus() {
    if (!selectedOrder) return;
    setSaving(true);
    await fetch(`/api/admin/orders/${selectedOrder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: selectedStatus } : o))
    );
    setSelectedOrder((prev) => prev ? { ...prev, status: selectedStatus } : prev);
    setSaving(false);
  }

  const counts: Record<string, number> = { all: orders.length };
  for (const o of orders) {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  }

  const filtered = orders.filter((o) => {
    const fk = filterKey(statusFilter);
    const matchSearch =
      !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = fk === "all" || o.status === fk;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-[20px] font-bold text-ad-dark">Order Management</h2>
          <p className="text-[12px] text-ad-gray">Manage and track all customer orders</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STAT_DEFS.map(({ label, key, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-[8px] px-4 py-4`}>
              <p className="text-[12px] text-ad-gray">{label}</p>
              <p className="text-[28px] font-bold text-ad-purple leading-tight">
                {loading ? "—" : (counts[key] ?? 0)}
              </p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="bg-[#fcfcfc] rounded-[8px] p-3 flex flex-col sm:flex-row gap-3 border border-ad-border">
          <div className="flex-1 flex items-center gap-2 bg-white border border-ad-border-light rounded-[6px] px-3 h-10">
            <Search className="w-4 h-4 text-ad-gray shrink-0" />
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[13px] outline-none text-ad-dark placeholder:text-ad-gray bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-ad-border rounded-[4px] px-3 h-10 min-w-[140px]">
            <Filter className="w-4 h-4 text-ad-gray shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 text-[13px] text-ad-dark outline-none bg-transparent"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-ad-purple" />
          </div>
        ) : (
          <div className="bg-[#fcfcfc] rounded-[8px] border border-ad-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-ad-border-light">
                  <tr>
                    {["Order Number", "Customer", "Total", "Status", "Date", "Actions"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-[12px] font-semibold text-ad-gray whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const style = STATUS_STYLE[order.status];
                    return (
                      <tr key={order.id} className="border-b border-ad-border-light last:border-none hover:bg-gray-50">
                        <td className="px-4 py-4 text-[13px] font-bold text-ad-dark">{order.order_number}</td>
                        <td className="px-4 py-4">
                          <p className="text-[13px] font-medium text-ad-dark">{order.customer_name ?? "—"}</p>
                          <p className="text-[12px] text-ad-gray">{order.customer_email ?? ""}</p>
                        </td>
                        <td className="px-4 py-4 text-[13px] font-medium text-ad-dark">
                          ${(order.total ?? 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`text-[12px] px-2 py-1 rounded-full font-medium ${style?.pill ?? ""}`}>
                            {style?.label ?? order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-ad-gray whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openOrder(order)}
                            className="text-ad-purple hover:text-ad-purple/70 transition-colors"
                            title="View order"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-[14px] text-ad-gray">
                        {orders.length === 0 ? "No orders yet." : "No orders match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] w-full max-w-[672px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-ad-border-light flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#232323]">Order Details</h3>
                <p className="text-[12px] text-ad-gray">{selectedOrder.order_number}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-ad-gray" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              {/* Customer info */}
              <div>
                <p className="text-[14px] font-bold text-[#232323] mb-3">Customer Information</p>
                <div className="bg-[#f9fafb] rounded-[16px] p-4 flex flex-col gap-2">
                  {[
                    { label: "Name",             value: selectedOrder.customer_name    ?? "—" },
                    { label: "Email",            value: selectedOrder.customer_email   ?? "—" },
                    { label: "Shipping Address", value: selectedOrder.shipping_address ?? "—" },
                    { label: "Payment Method",   value: selectedOrder.payment_method   ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-[14px]">
                      <span className="text-ad-gray w-36 shrink-0">{label}:</span>
                      <span className="text-ad-dark">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order items */}
              <div>
                <p className="text-[14px] font-bold text-[#232323] mb-3">Order Items</p>
                {lineItems.length === 0 ? (
                  <p className="text-[13px] text-ad-gray py-2">No items found.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {lineItems.map((item) => (
                      <div key={item.id} className="bg-[#f9fafb] rounded-[16px] px-4 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-[14px] font-medium text-ad-dark">{item.artwork_title ?? "Artwork"}</p>
                          <p className="text-[12px] text-ad-gray">
                            {item.artist_name ? `by ${item.artist_name} · ` : ""}Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="text-[14px] font-medium text-ad-dark">
                          ${((item.price ?? 0) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ad-border-light">
                  <p className="text-[14px] font-bold text-[#232323]">Total Amount</p>
                  <p className="text-[18px] font-bold text-ad-purple">
                    ${(selectedOrder.total ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="text-[14px] font-bold text-[#232323] mb-3">Update Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUS_BUTTONS.map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStatus(key)}
                      className={`flex items-center gap-2 px-4 h-9 rounded-[16px] text-[13px] border transition-colors ${
                        selectedStatus === key
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "bg-white border-ad-border text-ad-gray hover:border-ad-purple"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex gap-3 pt-2 border-t border-ad-border-light">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 h-[42px] rounded-[16px] bg-[#f3f4f6] text-[12px] font-bold text-[#354152]"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveStatus}
                  disabled={saving || selectedStatus === selectedOrder.status}
                  className="flex-1 h-[42px] rounded-[16px] bg-ad-purple text-white text-[12px] font-bold disabled:opacity-50 transition-opacity"
                >
                  {saving ? "Saving…" : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
