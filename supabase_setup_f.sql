-- Создание таблицы настроек фонов
CREATE TABLE IF NOT EXISTS background_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_bg_url TEXT,
  shop_bg_url TEXT,
  apply_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавление RLS политик
ALTER TABLE background_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON background_settings
  FOR SELECT USING (true);

CREATE POLICY "Admin write access" ON background_settings
  FOR ALL USING (true);

-- Вставка начальных настроек
INSERT INTO background_settings (home_bg_url, shop_bg_url, apply_global)
VALUES (NULL, NULL, false)
ON CONFLICT DO NOTHING;