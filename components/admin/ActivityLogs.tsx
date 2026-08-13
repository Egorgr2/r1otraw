"use client";

import { useEffect, useState } from "react";
import { getActivityLogs, type ActivityLog } from "@/lib/security";

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await getActivityLogs(50);
    setLogs(data);
    setLoading(false);
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login_success: "✅ Успешный вход",
      login_attempt: "❌ Попытка входа",
      product_created: "📦 Товар создан",
      product_updated: "✏️ Товар обновлен",
      product_deleted: "🗑️ Товар удален",
      settings_updated: "⚙️ Настройки обновлены",
    };
    return labels[action] || action;
  };

  const getStatusColor = (success: boolean) => {
    return success ? "text-green-400" : "text-red-400";
  };

  if (loading) {
    return (
      <div>
        <h2 className="mb-4 text-xs uppercase tracking-street">
          Логи активности
        </h2>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
          <div className="h-4 bg-surface-raised rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs uppercase tracking-street">
          Логи активности ({logs.length})
        </h2>
        <button
          type="button"
          onClick={loadLogs}
          className="text-[10px] font-bold uppercase tracking-wider text-white hover:text-muted border border-surface-border px-2 py-1 rounded"
        >
          Обновить
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted">
          Нет записей в логах
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-surface-border bg-black/50 p-3 rounded"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-white mb-1">
                    {getActionLabel(log.action)}
                  </p>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="text-[10px] text-muted mb-1">
                      {Object.entries(log.details).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-muted space-x-2">
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                    {log.user_agent && (
                      <span className="truncate max-w-xs">
                        {log.user_agent.substring(0, 50)}...
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold ${getStatusColor(log.success)}`}>
                    {log.success ? "Успех" : "Ошибка"}
                  </p>
                  <p className="text-[10px] text-muted">
                    {new Date(log.created_at).toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}