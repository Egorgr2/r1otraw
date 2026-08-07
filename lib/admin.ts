export const ADMIN_AUTH_KEY = "admin_auth";

export const CATEGORIES = ["Футболки", "Худі", "Взуття", "Інше"] as const;
export const SIZES = ["S", "M", "L", "XL"] as const;
export const STORAGE_BUCKET = "product-images";

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
