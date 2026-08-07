"use client";

import { useEffect, useState } from "react";

type SellerTabProps = {
  photo: string;
  name: string;
  description: string;
  username: string;
};

export function SellerTab({ photo, name, description, username }: SellerTabProps) {
  const [WebApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      setWebApp(module.default);
    });
  }, []);

  const handleWrite = () => {
    if (WebApp) {
      WebApp.openTelegramLink(`https://t.me/${username}`);
    } else {
      window.open(`https://t.me/${username}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border border-surface-border bg-surface-raised">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="mb-4 text-sm font-medium uppercase tracking-street">
        {name}
      </h2>

      <p className="mb-8 max-w-xs text-center text-xs leading-relaxed text-muted">
        {description}
      </p>

      <button
        type="button"
        onClick={handleWrite}
        className="w-full max-w-xs border border-white py-3.5 text-[10px] font-medium uppercase tracking-street transition-colors active:bg-white active:text-black"
      >
        Написать
      </button>
    </div>
  );
}
