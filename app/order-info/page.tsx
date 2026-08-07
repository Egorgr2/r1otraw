export default function OrderInfoPage() {
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-sm font-bold uppercase tracking-street">Информация о заказах</h1>
      </div>

      <div className="flex flex-col gap-4 py-6">
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-lg">📌</span>
            <h2 className="text-xs font-bold uppercase tracking-wider">Подзаказ</h2>
          </div>
          <div className="space-y-2 text-xs text-muted">
            <p>⏱ Ориентировочно 14–20 дней</p>
            <p>Товар доступен у поставщика и выкупается после оформления заказа.</p>
          </div>
        </div>
        
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-lg">📌</span>
            <h2 className="text-xs font-bold uppercase tracking-wider">Предзаказ</h2>
          </div>
          <div className="space-y-2 text-xs text-muted">
            <p>⏱ 20–35 дней и более (срок уточняется в ЛС)</p>
            <p>Оформляется до выхода товара в продажу.</p>
          </div>
        </div>

        <div className="border border-surface-border p-4 rounded-lg bg-surface-raised">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2">⚠️ Важно</h2>
          <p className="text-xs text-muted">
            После оформления заказа мы свяжемся с вами для подтверждения и уточнения деталей.
          </p>
        </div>
      </div>
    </div>
  );
}