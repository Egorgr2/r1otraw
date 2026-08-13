-- Создание таблицы настроек фонов
CREATE TABLE IF NOT EXISTS background_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_bg_url TEXT,
  shop_bg_url TEXT,
  apply_global BOOLEAN DEFAULT false,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  blur_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавление новых полей если они не существуют
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'background_settings' AND column_name = 'overlay_opacity'
    ) THEN
        ALTER TABLE background_settings ADD COLUMN overlay_opacity DECIMAL(3,2) DEFAULT 0.5;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'background_settings' AND column_name = 'blur_enabled'
    ) THEN
        ALTER TABLE background_settings ADD COLUMN blur_enabled BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Добавление RLS политик (проверяем существование)
ALTER TABLE background_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON background_settings;
CREATE POLICY "Public read access" ON background_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write access" ON background_settings;
CREATE POLICY "Admin write access" ON background_settings
  FOR ALL USING (true);

-- Вставка начальных настроек (только если таблица пуста)
INSERT INTO background_settings (home_bg_url, shop_bg_url, apply_global, overlay_opacity, blur_enabled)
SELECT NULL, NULL, false, 0.5, false
WHERE NOT EXISTS (SELECT 1 FROM background_settings);
