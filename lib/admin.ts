export const ADMIN_AUTH_KEY = "admin_auth";
export const ADMIN_SESSION_KEY = "admin_session";

export const CATEGORIES = [
  "Футболка",
  "Лонгслив",
  "Худи",
  "Зипхуди",
  "Свитер",
  "Кардиган",
  "Рубашка",
  "Пиджак",
  "Жилет",
  "Жилетка",
  "Бомбер",
  "Куртка",
  "Майка",
  "Брюки",
  "Штаны",
  "Джинсы",
  "Шорты",
  "Кроссовки",
  "Кеды",
  "Ботинки",
  "Сумка",
  "Ремень",
  "Кепка",
  "Шапка",
  "Очки",
  "Часы",
  "Подвеска",
  "Браслет",
  "Перчатки",
  "Шарф",
] as const;
export const SIZES = ["S", "M", "L", "XL"] as const;
export const STORAGE_BUCKET = "product-images";
export const DISABLE_STORAGE_UPLOAD = false; // Включаем загрузку в Storage

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  
  // Проверяем срок действия сессии (24 часа)
  const sessionData = JSON.parse(session);
  const now = Date.now();
  const sessionAge = now - sessionData.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 часа
  
  if (sessionAge > maxAge) {
    clearAdminAuthenticated();
    return false;
  }
  
  return true;
}

export function setAdminAuthenticated(): void {
  const sessionData = {
    timestamp: Date.now(),
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
}

export function clearAdminAuthenticated(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
