"use client";

import { useState } from "react";
import { setAdminAuthenticated } from "@/lib/admin";

type PinGateProps = {
  expectedPin: string;
  onSuccess: () => void;
};

export function PinGate({ expectedPin, onSuccess }: PinGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === expectedPin) {
      setAdminAuthenticated();
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h1 className="mb-6 text-center text-sm uppercase tracking-street">
          Admin
        </h1>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
            setPin(val);
            setError(false);
          }}
          placeholder="PIN"
          className="w-full border border-surface-border bg-surface-raised px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-white"
          autoFocus
        />
        {error && (
          <p className="mt-2 text-center text-xs text-red-400">
            Неверный PIN
          </p>
        )}
        <button
          type="submit"
          disabled={pin.length !== 4}
          className="mt-4 w-full bg-white py-3 text-[10px] font-medium uppercase tracking-street text-black disabled:opacity-40"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
