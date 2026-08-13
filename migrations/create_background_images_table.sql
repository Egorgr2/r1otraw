-- Создание таблицы для управления фоновыми изображениями
CREATE TABLE IF NOT EXISTS background_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('global', 'home', 'catalog', 'category', 'reviews', 'contacts', 'product')),
  category VARCHAR(255),
  image_url TEXT NOT NULL,
  overlay_color VARCHAR(7) DEFAULT '#000000',
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  position VARCHAR(20) DEFAULT 'center' CHECK (position IN ('center', 'top', 'bottom', 'left', 'right')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Обновляем CHECK constraint для типа, если таблица уже существует
ALTER TABLE background_images DROP CONSTRAINT IF EXISTS background_images_type_check;
ALTER TABLE background_images ADD CONSTRAINT background_images_type_check CHECK (type IN ('global', 'home', 'catalog', 'category', 'reviews', 'contacts', 'product'));

-- Создание индекса для быстрого поиска по типу и категории
CREATE INDEX IF NOT EXISTS idx_background_images_type ON background_images(type);
CREATE INDEX IF NOT EXISTS idx_background_images_category ON background_images(category);
CREATE INDEX IF NOT EXISTS idx_background_images_active ON background_images(is_active);

-- Создание триггера для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Удаляем триггер если он существует, затем создаем новый
DROP TRIGGER IF EXISTS update_background_images_updated_at ON background_images;

CREATE TRIGGER update_background_images_updated_at 
  BEFORE UPDATE ON background_images 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Отключаем Row Level Security (RLS) для упрощения использования через админ-панель
-- Админ-панель использует собственную систему авторизации через PIN-код
ALTER TABLE background_images DISABLE ROW LEVEL SECURITY;

-- Комментарии к таблице
COMMENT ON TABLE background_images IS 'Управление фоновыми изображениями для разных страниц и категорий';
COMMENT ON COLUMN background_images.type IS 'Тип страницы: home, catalog, category, reviews, contacts, product';
COMMENT ON COLUMN background_images.category IS 'Категория (для type=category)';
COMMENT ON COLUMN background_images.overlay_color IS 'Цвет затемнения в формате HEX';
COMMENT ON COLUMN background_images.overlay_opacity IS 'Прозрачность затемнения (0-1)';
COMMENT ON COLUMN background_images.position IS 'Позиция фонового изображения: center, top, bottom, left, right';