type SizeSelectorProps = {
  sizes: string[];
  selected: string | null;
  onSelect: (size: string) => void;
};

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold uppercase tracking-wider text-white">Выберите размер</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSelect(size)}
            className={`w-14 h-14 flex items-center justify-center border-2 text-sm font-bold uppercase tracking-wider transition-all rounded-lg hover:scale-105 ${
              selected === size
                ? "border-white bg-white text-black shadow-lg shadow-white/20"
                : "border-surface-border text-white hover:border-white/50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
