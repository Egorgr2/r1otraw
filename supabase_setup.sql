-- Создание таблицы для настроек главной страницы
CREATE TABLE IF NOT EXISTS home_page (
  id TEXT PRIMARY KEY DEFAULT 'default',
  title TEXT NOT NULL DEFAULT 'ПОПУЛЯРНЫЕ',
  featured_product_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка дефолтных настроек
INSERT INTO home_page (id, title, featured_product_ids)
VALUES ('default', 'ПОПУЛЯРНЫЕ', '{}')
ON CONFLICT (id) DO NOTHING;

-- Добавление поля status в таблицу products
ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Обновление существующих данных: если is_available = false то status = 'preorder'
UPDATE products SET status = CASE 
  WHEN is_available = false THEN 'preorder' 
  ELSE 'available' 
END WHERE status IS NULL OR status = 'available';