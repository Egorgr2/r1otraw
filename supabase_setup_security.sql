-- Создание таблицы акций
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  discount_percent DECIMAL NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  applicable_categories TEXT[] DEFAULT '{}',
  applicable_brands TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек безопасности
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_password TEXT NOT NULL, -- Хэшированный пароль
  admin_email TEXT,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  login_attempts INTEGER DEFAULT 0,
  last_login_attempt TIMESTAMP WITH TIME ZONE,
  blocked_until TIMESTAMP WITH TIME ZONE,
  ip_whitelist TEXT[], -- Список разрешенных IP
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы логов активности
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек магазина
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  primary_color TEXT DEFAULT '#ffffff',
  secondary_color TEXT DEFAULT '#000000',
  accent_color TEXT DEFAULT '#333333',
  logo_url TEXT,
  shop_name TEXT DEFAULT 'R1OTRAW',
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '{}',
  custom_css TEXT,
  custom_js TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_telegram TEXT,
  product_id UUID REFERENCES products(id),
  product_title TEXT NOT NULL,
  product_price DECIMAL NOT NULL,
  size TEXT,
  quantity INTEGER DEFAULT 1,
  total_price DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  delivery_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы статистики
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- page_view, product_view, add_to_cart, order_created
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Добавление RLS политик
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Политики для promotions
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Admin full access" ON promotions
  FOR ALL USING (true);

-- Обновление таблицы отзывов с полем approved
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Политики для security_settings
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Admin only access" ON security_settings
  FOR ALL USING (true);

-- Политики для activity_logs
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Admin read access" ON activity_logs
  FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON activity_logs
  FOR INSERT WITH CHECK (true);

-- Политики для shop_settings
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Public read access" ON shop_settings
  FOR SELECT USING (true);
CREATE POLICY "Admin write access" ON shop_settings
  FOR ALL USING (true);

-- Политики для orders
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Admin full access" ON orders
  FOR ALL USING (true);

-- Политики для analytics
-- ВНИМАНИЕ: Для продакшена нужно заменить true на реальные проверки аутентификации Supabase Auth
CREATE POLICY "Admin full access" ON analytics
  FOR ALL USING (true);

-- Вставка начальных настроек
INSERT INTO security_settings (admin_password, admin_email)
VALUES ('$2b$10$YourHashedPasswordHere', 'admin@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO shop_settings (shop_name, primary_color, secondary_color, accent_color)
VALUES ('R1OTRAW', '#ffffff', '#000000', '#333333')
ON CONFLICT DO NOTHING;