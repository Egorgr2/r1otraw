type SizeSelectorProps = {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] uppercase tracking-wider text-muted">Размер</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`min-w-[3rem] border px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
              selected === size
                ? "border-white bg-white text-black"
                : "border-surface-border text-white active:border-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
