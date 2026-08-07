export default function ContactsPage() {
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="sticky top-0 z-10 flex items-center border-b border-surface-border bg-black/95 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-sm font-bold uppercase tracking-street">Контакты</h1>
      </div>

      <div className="flex flex-col gap-6 py-6">
        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Telegram</h2>
          <p className="text-sm text-white">@KOREAGRAVESS</p>
        </div>

        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Время работы</h2>
          <p className="text-xs text-muted">Ежедневно с 10:00 до 22:00</p>
        </div>

        <div className="border border-surface-border p-4 rounded-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3">Вопросы и заказы</h2>
          <p className="text-xs text-muted">
            По всем вопросам обращайтесь в Telegram. Ответим в течение 30 минут.
          </p>
        </div>
      </div>
    </div>
  );
}