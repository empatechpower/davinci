"use client";

import { useState } from "react";
import { Search, X, Eye, Clock, Package, Truck, CheckCircle, XCircle, Filter } from "lucide-react";
import { ORDERS } from "@/lib/mock-data";

type Order = (typeof ORDERS)[0];

const STATUS_OPTIONS = ["All Status", "New Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLE: Record<string, { pill: string; label: string }> = {
  new: { pill: "bg-blue-100 text-blue-700 border border-blue-200", label: "New" },
  processing: { pill: "bg-yellow-100 text-yellow-700 border border-yellow-200", label: "Processing" },
  shipped: { pill: "bg-purple-100 text-purple-700 border border-purple-200", label: "Shipped" },
  delivered: { pill: "bg-green-100 text-green-700 border border-green-200", label: "Delivered" },
  cancelled: { pill: "bg-red-100 text-red-700 border border-red-200", label: "Cancelled" },
};

const ORDER_STATUS_BUTTONS = [
  { key: "new", label: "New", Icon: Clock },
  { key: "processing", label: "Processing", Icon: Package },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: CheckCircle },
  { key: "cancelled", label: "Cancelled", Icon: XCircle },
] as const;

const STAT_CARDS = [
  { label: "Total Orders", value: "4", bg: "bg-white", border: "border-ad-border" },
  { label: "New Orders", value: "1", bg: "bg-blue-50", border: "border-blue-200" },
  { label: "Processing", value: "1", bg: "bg-yellow-50", border: "border-yellow-200" },
  { label: "Shipped", value: "1", bg: "bg-purple-50", border: "border-purple-200" },
  { label: "Delivered", value: "1", bg: "bg-green-50", border: "border-green-200" },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("new");

  const filtered = ORDERS.filter((o) => {
    const matchSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All Status" ||
      o.status === statusFilter.toLowerCase().replace(" orders", "").replace("new", "new");
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h2 className="text-[20px] font-bold text-ad-dark">Order Management</h2>
          <p className="text-[12px] text-ad-gray">Manage and track all customer orders</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {STAT_CARDS.map(({ label, value, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-[8px] px-4 py-4`}>
              <p className="text-[12px] text-ad-gray">{label}</p>
              <p className="text-[28px] font-bold text-ad-purple leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* Search + filter bar */}
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

        {/* Orders table */}
        <div className="bg-[#fcfcfc] rounded-[8px] border border-ad-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9fafb] border-b border-ad-border-light">
                <tr>
                  {["Order Number", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((col) => (
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
                      <td className="px-4 py-4 text-[13px] font-bold text-ad-dark">{order.id}</td>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-medium text-ad-dark">{order.customer}</p>
                        <p className="text-[12px] text-ad-gray">{order.email}</p>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-ad-gray">{order.items} item{order.items > 1 ? "s" : ""}</td>
                      <td className="px-4 py-4 text-[13px] font-medium text-ad-dark">{order.total}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[12px] px-2 py-1 rounded-full font-medium ${style?.pill}`}>
                          {style?.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-ad-gray whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => { setSelectedOrder(order); setSelectedStatus(order.status); }}
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
                    <td colSpan={7} className="px-4 py-10 text-center text-[14px] text-ad-gray">
                      No orders match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] w-full max-w-[672px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-ad-border-light flex items-start justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#232323]">Order Details</h3>
                <p className="text-[12px] text-ad-gray">{selectedOrder.id}</p>
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
                    { label: "Name", value: selectedOrder.customer },
                    { label: "Email", value: selectedOrder.email },
                    { label: "Shipping Address", value: selectedOrder.shippingAddress },
                    { label: "Payment Method", value: selectedOrder.paymentMethod },
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
                <div className="flex flex-col gap-3">
                  {selectedOrder.lineItems.map((item, i) => (
                    <div key={i} className="bg-[#f9fafb] rounded-[16px] px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-medium text-ad-dark">{item.title}</p>
                        <p className="text-[12px] text-ad-gray">by {item.artist} · Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-[14px] font-medium text-ad-dark">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ad-border-light">
                  <p className="text-[14px] font-bold text-[#232323]">Total Amount</p>
                  <p className="text-[18px] font-bold text-ad-purple">{selectedOrder.total}</p>
                </div>
              </div>

              {/* Update status — icon buttons matching Figma */}
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
                <button className="flex-1 h-[42px] rounded-[16px] bg-ad-purple text-white text-[12px] font-bold">
                  Send Email Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
