"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

type Customer = {
  id: string;
  name: string;
  phone: string;
  telegram: string | null;
  total_orders: number;
  total_spent: number;
  last_order: string | null;
  created_at: string;
};

export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Поскольку у нас нет таблицы customers, создаем демо-данные
      // В реальном приложении нужна отдельная таблица customers
      const mockCustomers: Customer[] = [
        {
          id: "1",
          name: "Иван Петров",
          phone: "+380991234567",
          telegram: "@ivan_petrov",
          total_orders: 5,
          total_spent: 15000,
          last_order: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Мария Иванова",
          phone: "+380997654321",
          telegram: "@maria_ivanova",
          total_orders: 3,
          total_spent: 8500,
          last_order: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 604800000).toISOString(),
        },
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.telegram && customer.telegram.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [customers, searchTerm]);

  if (loading) {
    return (
      <div className="border border-surface-border p-4">
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Управление клиентами
        </h2>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-surface-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Управление клиентами ({customers.length})
        </h2>
        <button
          type="button"
          onClick={loadCustomers}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {/* Поиск */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по имени, телефону или Telegram..."
          className="w-full text-[10px] bg-black border border-surface-border text-white px-3 py-2 rounded focus:border-white focus:outline-none"
        />
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Всего клиентов
          </p>
          <p className="text-2xl font-bold text-white">
            {customers.length}
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Всего заказов
          </p>
          <p className="text-2xl font-bold text-white">
            {customers.reduce((sum, c) => sum + c.total_orders, 0)}
          </p>
        </div>
        <div className="border border-surface-border bg-black/50 p-3 rounded">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
            Общая выручка
          </p>
          <p className="text-2xl font-bold text-white">
            {customers.reduce((sum, c) => sum + c.total_spent, 0)} ₴
          </p>
        </div>
      </div>

      {/* Список клиентов */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">
            Нет клиентов
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="border border-surface-border bg-black/50 p-3 rounded"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-white">{customer.name}</p>
                  <p className="text-[10px] text-muted">{customer.phone}</p>
                  {customer.telegram && (
                    <p className="text-[10px] text-muted">{customer.telegram}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{customer.total_orders} заказов</p>
                  <p className="text-[10px] text-muted">{customer.total_spent} ₴</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted">
                <span>
                  Последний заказ: {customer.last_order 
                    ? new Date(customer.last_order).toLocaleDateString("ru-RU")
                    : "Нет"
                  }
                </span>
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  История
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-[10px] text-muted">
        ℹ️ Для полноценного управления клиентами нужна отдельная таблица customers в базе данных.
        Сейчас показаны демо-данные.
      </div>
    </div>
  );
}