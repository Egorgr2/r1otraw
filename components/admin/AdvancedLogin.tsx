"use client";

import { useState } from "react";
import { authenticateAdmin, createAdminSession, isValidAdminSession } from "@/lib/security";

type AdvancedLoginProps = {
  onLoginSuccess: () => void;
};

export function AdvancedLogin({ onLoginSuccess }: AdvancedLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Получаем IP адрес (на клиенте это будет приблизительно)
    const ipAddress = typeof window !== "undefined" ? "client_ip" : undefined;
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : undefined;

    const result = await authenticateAdmin(password, ipAddress, userAgent);

    if (result.success) {
      createAdminSession();
      onLoginSuccess();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="border border-surface-border bg-black/80 backdrop-blur-xl p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-street text-white mb-2">
              R1OTRAW
            </h1>
            <p className="text-xs text-muted uppercase tracking-wider">
              Админ-панель
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Пароль администратора
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full border border-surface-border bg-black px-4 py-3 text-sm text-white placeholder:text-muted focus:border-white focus:outline-none rounded"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-red-500/50 bg-red-500/10 px-4 py-3 rounded">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white py-3 text-sm font-bold uppercase tracking-wider text-black disabled:opacity-40 hover:bg-gray-200 transition-colors rounded"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-border">
            <div className="space-y-2 text-[10px] text-muted">
              <p>🔒 Защищенное соединение</p>
              <p>📊 Логирование всех попыток входа</p>
              <p>⚡ Ограничение попыток: 5 за 15 минут</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}