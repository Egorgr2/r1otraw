export default function OrderInfoPage() {
  return (
    <div className="min-h-screen px-4 py-6">
      <h1 className="text-sm font-bold uppercase tracking-street mb-6">Информация о заказах</h1>
      
      <div className="flex flex-col gap-4 text-xs">
        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="font-bold uppercase tracking-wider mb-2">📌 Подзаказ</h2>
          <p className="text-muted">Ориентировочно 14–20 дней.</p>
          <p className="text-muted">Товар доступен у поставщика и выкупается после оформления заказа.</p>
        </div>
        
        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="font-bold uppercase tracking-wider mb-2">📌 Предзаказ</h2>
          <p className="text-muted">20–35 дней и более (срок уточняется в ЛС).</p>
          <p className="text-muted">Оформляется до выхода товара в продажу.</p>
        </div>
      </div>
    </div>
  );
}