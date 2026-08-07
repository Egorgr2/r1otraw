"use client";

export function HomePage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-street mb-4">r1otRaw</h1>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
          Здесь публикуются реплики и товары высокого качества. Доступны разные уровни исполнения — от бюджетных до максимально приближенных к оригиналу.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Отзывы */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💬</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Отзывы</h2>
          </div>
          <a
            href="https://t.me/otzivir1otraw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white hover:text-muted underline"
          >
            https://t.me/otzivir1otraw
          </a>
        </div>

        {/* Связь */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📩</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Связь</h2>
          </div>
          <p className="text-sm text-muted">
            Обратиться: <a href="https://t.me/KOREAGRAVESS" target="_blank" rel="noopener noreferrer" className="text-white hover:text-muted underline">@KOREAGRAVESS</a>
          </p>
        </div>

        {/* Доставка */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚚</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Доставка</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>• Украина</p>
            <p>• Товары в наличии — отправка в течение 1–3 дней</p>
            <p>• Заказ под выкуп — ориентировочно 14–20 дней</p>
          </div>
        </div>

        {/* Оплата */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💳</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Оплата</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>1) • Полная предоплата</p>
            <p>2) • Перед выкупом товара вы оплачиваете 50% его стоимости. После того как товар приходит ко мне и я подтверждаю его наличие фото или видео, вы оплачиваете оставшиеся 50%. Затем я отправляю заказ вам.</p>
          </div>
        </div>

        {/* Способы получения */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📦</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Способы получения</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>• Новая Почта/Укр Почта/Meest</p>
            <p>• OLX Доставка</p>
            <p>• Наложенный платеж (предоплата 150 грн)</p>
          </div>
        </div>

        {/* Как оформить заказ */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📋</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Как оформить заказ</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>• Отправьте ссылку или фото товара.</p>
            <p>• Получите расчет стоимости и сроков.</p>
            <p>• Подтвердите заказ и оплатите удобным способом.</p>
          </div>
        </div>

        {/* Возврат */}
        <div className="border border-surface-border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔄</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">Возврат</h2>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <p>• До момента отправки заказ можно отменить.</p>
            <p>• При обнаружении заводского брака вопрос решается индивидуально.</p>
          </div>
        </div>
      </div>
    </div>
  );
}