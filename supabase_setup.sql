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

-- Создание функции для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создание триггера
CREATE TRIGGER update_home_page_updated_at
  BEFORE UPDATE ON home_page
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();