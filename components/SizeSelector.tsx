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
            className={`w-12 h-12 flex items-center justify-center border text-xs font-bold uppercase tracking-wider transition-colors rounded ${
              selected === size
                ? "border-white bg-white text-black"
                : "border-surface-border text-white hover:border-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
