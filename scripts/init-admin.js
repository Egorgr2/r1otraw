/**
 * Скрипт для инициализации пароля администратора
 * Запустите: node scripts/init-admin.js yourpassword
 */

const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('Использование: node scripts/init-admin.js ваш_пароль');
    console.log('Пример: node scripts/init-admin.js MySecurePassword123');
    process.exit(1);
  }

  const hash = hashPassword(password);
  
  console.log('=== Инициализация пароля администратора ===');
  console.log('');
  console.log('Скопируйте этот SQL запрос и выполните его в Supabase:');
  console.log('');
  console.log(`UPDATE security_settings SET admin_password = '${hash}' WHERE id = (SELECT id FROM security_settings LIMIT 1);`);
  console.log('');
  console.log('Или вставьте при создании записи:');
  console.log(`INSERT INTO security_settings (admin_password, admin_email) VALUES ('${hash}', 'admin@example.com');`);
  console.log('');
  console.log('⚠️  Сохраните пароль в безопасном месте!');
}

main().catch(console.error);