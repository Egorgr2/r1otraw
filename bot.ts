import { Bot, InlineKeyboard } from "grammy";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN is not set in .env file");
    process.exit(1);
  }

  const bot = new Bot(token);
  const webAppUrl = process.env.WEBAPP_URL || "https://r1otraw-71.vercel.app";
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Resale Shop";
  const logoUrl = process.env.LOGO_URL;

  console.log("🤖 Starting bot...");
  console.log(`📱 Shop: ${shopName}`);
  console.log(`🌐 WebApp URL: ${webAppUrl}`);

  // Команда /start
  bot.command("start", async (ctx) => {
    console.log(`📩 /start command from user ${ctx.from?.id}`);
    
    const caption =
      `👋 Добро пожаловать в ${shopName}!\n\n` +
      `Здесь публикуются реплики и товары высокого качества.\n` +
      `Нажмите кнопку ниже, чтобы открыть магазин.`;

    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl
    );

    try {
      if (logoUrl) {
        await ctx.replyWithPhoto(logoUrl, {
          caption,
          reply_markup: keyboard,
        });
      } else {
        await ctx.reply(caption, { reply_markup: keyboard });
      }
      console.log("✅ /start command handled successfully");
    } catch (error) {
      console.error("❌ Error handling /start:", error);
    }
  });

  // Команда /help
  bot.command("help", async (ctx) => {
    console.log(`📩 /help command from user ${ctx.from?.id}`);
    
    const helpText =
      `📖 Справка по ${shopName}\n\n` +
      `Доступные команды:\n` +
      `/start - Открыть магазин\n` +
      `/help - Эта справка\n\n` +
      `💾 Реплики и товары высокого качества`;

    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl
    );

    try {
      await ctx.reply(helpText, { reply_markup: keyboard });
      console.log("✅ /help command handled successfully");
    } catch (error) {
      console.error("❌ Error handling /help:", error);
    }
  });

  // Обработка любого текста
  bot.on("message:text", async (ctx) => {
    console.log(`📩 Text message from user ${ctx.from?.id}: ${ctx.message.text}`);
    
    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl
    );

    try {
      await ctx.reply(
        `Напишите /start для открытия ${shopName}`,
        { reply_markup: keyboard }
      );
      console.log("✅ Text message handled successfully");
    } catch (error) {
      console.error("❌ Error handling text message:", error);
    }
  });

  // Удаляем webhook перед запуском polling
  console.log("🗑️  Deleting webhook if exists...");
  await bot.api.deleteWebhook().catch(() => {});

  // Запускаем бота
  console.log("🚀 Starting bot polling...");
  bot.start();
  console.log("✅ Bot is running! Press Ctrl+C to stop.");
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});