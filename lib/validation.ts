// Утилиты для валидации и санитизации пользовательских вводов

/**
 * Валидация URL изображения
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    // Разрешаем только http и https протоколы
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    
    // Проверяем, что это не javascript: протокол
    if (url.startsWith('javascript:')) return false;
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Санитизация URL изображения
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Удаляем потенциально опасные протоколы
    if (['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Валидация строки на безопасность
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  // Удаляем потенциально опасные символы
  return input
    .replace(/[<>]/g, '') // Удаляем < и >
    .replace(/javascript:/gi, '') // Удаляем javascript:
    .replace(/on\w+\s*=/gi, '') // Удаляем обработчики событий
    .trim();
}

/**
 * Валидация цены
 */
export function isValidPrice(price: string | number): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 1000000;
}

/**
 * Валидация телефона
 */
export function isValidPhone(phone: string): boolean {
  // Простая валидация для украинских номеров
  const phoneRegex = /^\+380\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Валидация email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Валидация процента скидки
 */
export function isValidDiscount(discount: string | number): boolean {
  const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;
  return !isNaN(numDiscount) && numDiscount >= 0 && numDiscount <= 100;
}

/**
 * Валидация названия товара
 */
export function isValidProductName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 200;
}

/**
 * Валидация названия бренда
 */
export function isValidBrandName(name: string): boolean {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Санитизация CSS для инъекции
 */
export function sanitizeCSS(css: string): string {
  if (!css) return '';
  
  // Удаляем потенциально опасные конструкции
  return css
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Валидация JSON данных
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}