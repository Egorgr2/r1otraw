-- Проверка таблицы background_settings
SELECT * FROM background_settings;

-- Если таблица пуста, вставим начальные данные
INSERT INTO background_settings (home_bg_url, shop_bg_url, apply_global)
SELECT NULL, NULL, false
WHERE NOT EXISTS (SELECT 1 FROM background_settings);
