import { supabase } from "./supabase";

export const ADMIN_SESSION_KEY = "admin_session";
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 минут

export interface SecuritySettings {
  id: string;
  admin_password: string;
  admin_email: string | null;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  login_attempts: number;
  last_login_attempt: string | null;
  blocked_until: string | null;
  ip_whitelist: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  details: any;
  created_at: string;
}

// ВНИМАНИЕ: SHA-256 не подходит для хэширования паролей!
// Для продакшена нужно использовать bcrypt через API эндпоинт
// Это временная реализация для демонстрации
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Получение настроек безопасности
export async function getSecuritySettings(): Promise<SecuritySettings | null> {
  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }
  
  const { data, error } = await supabase
    .from("security_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching security settings:", error);
    return null;
  }
  return data;
}

// Логирование активности
export async function logActivity(
  action: string,
  success: boolean,
  details: any = {},
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  if (!supabase) {
    console.error("Supabase client not available for logging");
    return;
  }
  
  try {
    await supabase.from("activity_logs").insert({
      action,
      success,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

// Проверка блокировки
export async function isBlocked(): Promise<boolean> {
  const settings = await getSecuritySettings();
  if (!settings || !settings.blocked_until) return false;

  const blockedUntil = new Date(settings.blocked_until);
  const now = new Date();

  if (now < blockedUntil) {
    return true;
  }

  // Сброс блокировки если время прошло
  if (supabase) {
    await supabase
      .from("security_settings")
      .update({ blocked_until: null, login_attempts: 0 })
      .eq("id", settings.id);
  }

  return false;
}

// Проверка IP whitelist
export async function isIpAllowed(ip: string): Promise<boolean> {
  const settings = await getSecuritySettings();
  if (!settings || !settings.ip_whitelist || settings.ip_whitelist.length === 0) {
    return true; // Если whitelist пуст, разрешаем все
  }

  return settings.ip_whitelist.includes(ip);
}

// Увеличение счетчика неудачных попыток
export async function incrementFailedAttempts(): Promise<void> {
  const settings = await getSecuritySettings();
  if (!settings || !supabase) return;

  const newAttempts = (settings.login_attempts || 0) + 1;

  if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    // Блокируем на LOCKOUT_DURATION
    const blockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
    await supabase
      .from("security_settings")
      .update({
        login_attempts: newAttempts,
        blocked_until: blockedUntil.toISOString(),
        last_login_attempt: new Date().toISOString(),
      })
      .eq("id", settings.id);
  } else {
    await supabase
      .from("security_settings")
      .update({
        login_attempts: newAttempts,
        last_login_attempt: new Date().toISOString(),
      })
      .eq("id", settings.id);
  }
}

// Сброс счетчика попыток
export async function resetFailedAttempts(): Promise<void> {
  const settings = await getSecuritySettings();
  if (!settings || !supabase) return;

  await supabase
    .from("security_settings")
    .update({
      login_attempts: 0,
      last_login_attempt: new Date().toISOString(),
    })
    .eq("id", settings.id);
}

// Продвинутая аутентификация
export async function authenticateAdmin(
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; message: string }> {
  // Проверка блокировки
  if (await isBlocked()) {
    await logActivity("login_attempt", false, { reason: "blocked" }, ipAddress, userAgent);
    return {
      success: false,
      message: `Слишком много неудачных попыток. Попробуйте через ${Math.ceil(LOCKOUT_DURATION / 60000)} минут.`,
    };
  }

  // Проверка IP whitelist
  if (ipAddress && !(await isIpAllowed(ipAddress))) {
    await logActivity("login_attempt", false, { reason: "ip_not_allowed" }, ipAddress, userAgent);
    return {
      success: false,
      message: "Ваш IP-адрес не разрешен для доступа.",
    };
  }

  const settings = await getSecuritySettings();
  if (!settings) {
    await logActivity("login_attempt", false, { reason: "no_settings" }, ipAddress, userAgent);
    return {
      success: false,
      message: "Настройки безопасности не найдены.",
    };
  }

  // Проверка пароля
  const isValid = await verifyPassword(password, settings.admin_password);

  if (isValid) {
    await resetFailedAttempts();
    await logActivity("login_success", true, {}, ipAddress, userAgent);
    return {
      success: true,
      message: "Вход выполнен успешно.",
    };
  } else {
    await incrementFailedAttempts();
    await logActivity("login_attempt", false, { reason: "invalid_password" }, ipAddress, userAgent);
    const currentAttempts = settings.login_attempts || 0;
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - currentAttempts - 1;
    return {
      success: false,
      message: remainingAttempts > 0
        ? `Неверный пароль. Осталось попыток: ${remainingAttempts}`
        : "Неверный пароль. Аккаунт временно заблокирован.",
    };
  }
}

// Создание сессии
export function createAdminSession(): void {
  if (typeof window === "undefined") return;
  
  const sessionData = {
    timestamp: Date.now(),
    ipAddress: "client",
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
}

// Проверка сессии
export function isValidAdminSession(): boolean {
  if (typeof window === "undefined") return false;
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;

  try {
    const sessionData = JSON.parse(session);
    const now = Date.now();
    const sessionAge = now - sessionData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа

    if (sessionAge > maxAge) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error parsing session:", error);
    clearAdminSession();
    return false;
  }
}

// Удаление сессии
export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Получение логов активности
export async function getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
  if (!supabase) {
    console.error("Supabase client not available");
    return [];
  }
  
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
  return data || [];
}