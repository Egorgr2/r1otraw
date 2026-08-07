import { NextResponse } from "next/server";
import { Bot, InlineKeyboard, webhookCallback } from "grammy";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  НАСТРОЙКА TELEGRAM-БОТА ПОСЛЕ ДЕПЛОЯ НА VERCEL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. ЗАРЕГИСТРИРОВАТЬ WEBHOOK (один раз после деплоя)
 *
 *    Подставьте TELEGRAM_BOT_TOKEN и URL вашего деплоя:
 *
 *    curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
 *      -H "Content-Type: application/json" \
 *      -d '{"url":"https://<your-app>.vercel.app/api/bot"}'
 *
 *    Проверить статус webhook:
 *
 *    curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo"
 *
 * 2. ПРИВЯЗАТЬ MINI APP ЧЕРЕЗ @BotFather
 *
 *    a) Откройте @BotFather в Telegram
 *    b) Отправьте /mybots → выберите своего бота → Bot Settings → Menu Button
 *       (или сразу /newapp)
 *    c) Команда /newapp:
 *       - Выберите бота
 *       - Title: KOREAGRAVESS (или название магазина)
 *       - Description: короткое описание магазина
 *       - Photo: загрузите логотип (640×360)
 *       - Demo URL / Web App URL: https://<your-app>.vercel.app
 *       - Short name: koreagravessshop (латиница, без пробелов)
 *    d) URL Mini App должен совпадать с WEBAPP_URL в .env
 *
 * Переменные окружения на Vercel:
 *   TELEGRAM_BOT_TOKEN, LOGO_URL, WEBAPP_URL, NEXT_PUBLIC_SHOP_NAME
 * ═══════════════════════════════════════════════════════════════════════════
 */

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  const bot = new Bot(token);

  bot.command("start", async (ctx) => {
    const logoUrl = process.env.LOGO_URL;
    const webAppUrl = process.env.WEBAPP_URL;
    const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop";

    const caption =
      `👋 Вітаємо в ${shopName}!\n\n` +
      `Винтаж і реселл одягу.\n` +
      `Натисни кнопку нижче, щоб відкрити каталог.`;

    const keyboard = new InlineKeyboard().webApp(
      "Відкрити каталог",
      webAppUrl ?? "https://your-app.vercel.app"
    );

    if (logoUrl) {
      await ctx.replyWithPhoto(logoUrl, {
        caption,
        reply_markup: keyboard,
      });
    } else {
      await ctx.reply(caption, { reply_markup: keyboard });
    }
  });

  return bot;
}

type WebhookHandler = (request: Request) => Response | Promise<Response>;

let handleUpdate: WebhookHandler | null = null;

function getHandler(): WebhookHandler {
  if (!handleUpdate) {
    handleUpdate = webhookCallback(createBot(), "std/http");
  }
  return handleUpdate;
}

export async function POST(request: Request) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    return await getHandler()(request);
  } catch (error) {
    console.error("Bot webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram bot webhook is active",
    endpoint: "/api/bot",
  });
}
