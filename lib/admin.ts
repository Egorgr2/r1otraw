export const ADMIN_AUTH_KEY = "admin_auth";

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
  return localStorage.getItem(ADMIN_AUTH_KEY) === "1";
}

export function setAdminAuthenticated(): void {
  localStorage.setItem(ADMIN_AUTH_KEY, "1");
}

export function clearAdminAuthenticated(): void {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}
