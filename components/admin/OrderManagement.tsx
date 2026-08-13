"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_telegram: string | null;
  product_title: string;
  product_price: number;
  size: string | null;
  quantity: number;
  total_price: number;
  status: string;
  payment_method: string | null;
  payment_status: string;
  delivery_address: string | null;
  delivery_method: string | null;
  notes: string | null;
  created_at: string;
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) {
      loadOrders();
    }
  };

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const statusLabels = {
    pending: "Ожидает",
    confirmed: "Подтвержден",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменен",
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Управление заказами ({orders.length})
        </h2>
        <button
          type="button"
          onClick={loadOrders}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Фильтр по статусу */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          type="button"
          onClick={() => setFilterStatus("all")}
          className={`text-[10px] px-2 py-1 rounded border ${
            filterStatus === "all"
              ? "border-white bg-white text-black"
              : "border-surface-border text-muted"
          }`}
        >
          Все
        </button>
        {Object.keys(statusLabels).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilterStatus(status)}
            className={`text-[10px] px-2 py-1 rounded border ${
              filterStatus === status
                ? "border-white bg-white text-black"
                : "border-surface-border text-muted"
            }`}
          >
            {statusLabels[status as keyof typeof statusLabels]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted">
          Нет заказов
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-surface-border bg-black/50 p-3 rounded"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-white mb-1">
                    {order.customer_name}
                  </p>
                  <p className="text-[10px] text-muted mb-1">
                    📱 {order.customer_phone}
                  </p>
                  {order.customer_telegram && (
                    <p className="text-[10px] text-muted mb-1">
                      📩 {order.customer_telegram}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </span>
                </div>
              </div>

              <div className="border-t border-surface-border pt-2 mt-2">
                <p className="text-xs text-white mb-1">
                  📦 {order.product_title}
                </p>
                <div className="flex items-center gap-4 text-[10px] text-muted">
                  <span>💰 {order.product_price} ₴</span>
                  {order.size && <span>📏 {order.size}</span>}
                  <span>🔢 {order.quantity} шт</span>
                  <span className="text-white font-bold">
                    Итого: {order.total_price} ₴
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="flex-1 text-[10px] bg-black border border-surface-border text-white px-2 py-1 rounded focus:border-white focus:outline-none"
                >
                  {Object.keys(statusLabels).map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status as keyof typeof statusLabels]}
                    </option>
                  ))}
                </select>
              </div>

              {order.notes && (
                <div className="mt-2 text-[10px] text-muted bg-surface-raised p-2 rounded">
                  📝 {order.notes}
                </div>
              )}

              <p className="text-[10px] text-muted mt-2">
                {new Date(order.created_at).toLocaleString("ru-RU")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}