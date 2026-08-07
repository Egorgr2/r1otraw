export type Tab = "catalog" | "reviews" | "seller";

type HeaderProps = {
  shopName: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "catalog", label: "КАТАЛОГ" },
  { id: "reviews", label: "ОТЗЫВЫ" },
  { id: "seller", label: "ПРОДАВЕЦ" },
];

export function Header({ shopName, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-surface-border bg-black/95 backdrop-blur-sm">
      <div className="px-4 pb-3 pt-5">
        <h1 className="text-center text-sm font-medium uppercase tracking-street">
          {shopName}
        </h1>
      </div>
      <nav className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 border-b py-3 text-[10px] font-medium uppercase tracking-street transition-colors ${
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
