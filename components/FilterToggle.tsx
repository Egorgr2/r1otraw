type FilterToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function FilterToggle({ value, onChange }: FilterToggleProps) {
  return (
    <div className="flex gap-2 px-4 py-4">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 border py-2.5 text-[10px] uppercase tracking-wider transition-colors ${
          !value
            ? "border-white bg-white text-black"
            : "border-surface-border text-muted"
        }`}
      >
        Под заказ
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 border py-2.5 text-[10px] uppercase tracking-wider transition-colors ${
          value
            ? "border-white bg-white text-black"
            : "border-surface-border text-muted"
        }`}
      >
        В наличии
      </button>
    </div>
  );
}
