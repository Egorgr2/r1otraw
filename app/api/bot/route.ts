import { NextResponse } from "next/server";
import { Bot, InlineKeyboard, webhookCallback } from "grammy";

/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  TELEGRAM БОТ (WEBHOOK MODE)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * После деплоя нужно настроить webhook:
 * 
 * 1. Удалить старый webhook:
 *    curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
 * 
 * 2. Установить новый webhook:
 *    curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
 *      -H "Content-Type: application/json" \
 *      -d '{"url":"https://r1otraw-71.vercel.app/api/bot"}'
 */

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");

  const bot = new Bot(token);

  // Логирование для отладки
  bot.use((ctx, next) => {
    console.log("Received update:", JSON.stringify(ctx.update, null, 2));
    return next();
  });

  bot.command("start", async (ctx) => {
    console.log("Handling /start command");
    const logoUrl = process.env.LOGO_URL;
    const webAppUrl = process.env.WEBAPP_URL;
    const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop";

    const caption =
      `👋 Добро пожаловать в ${shopName}!\n\n` +
      `Здесь публикуются реплики и товары высокого качества.\n` +
      `Доступны разные уровни исполнения — от бюджетных до максимально приближенных к оригиналу.\n\n` +
      `Нажмите кнопку ниже, чтобы открыть магазин.`;

    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl ?? "https://your-app.vercel.app"
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
      console.log("/start command handled successfully");
    } catch (error) {
      console.error("Error handling /start:", error);
    }
  });

  bot.command("help", async (ctx) => {
    console.log("Handling /help command");
    const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop";
    const webAppUrl = process.env.WEBAPP_URL;

    const helpText =
      `📖 Справка по ${shopName}\n\n` +
      `Доступные команды:\n` +
      `/start - Открыть магазин\n` +
      `/help - Эта справка\n\n` +
      `💾 Реплики и товары высокого качества`;

    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl ?? "https://your-app.vercel.app"
    );

    try {
      await ctx.reply(helpText, { reply_markup: keyboard });
      console.log("/help command handled successfully");
    } catch (error) {
      console.error("Error handling /help:", error);
    }
  });

  bot.on("message:text", async (ctx) => {
    console.log("Handling text message");
    const webAppUrl = process.env.WEBAPP_URL;
    const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "Resale Shop";

    const keyboard = new InlineKeyboard().webApp(
      "Открыть магазин",
      webAppUrl ?? "https://your-app.vercel.app"
    );

    try {
      await ctx.reply(
        `Напишите /start для открытия ${shopName}`,
        { reply_markup: keyboard }
      );
      console.log("Text message handled successfully");
    } catch (error) {
      console.error("Error handling text message:", error);
    }
  });

  return bot;
}

let handleUpdate: any = null;

function getHandler() {
  if (!handleUpdate) {
    handleUpdate = webhookCallback(createBot(), "std/http");
  }
  return handleUpdate;
}

export async function POST(request: Request) {
  console.log("Received POST request to /api/bot");
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not configured");
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await getHandler()(request);
    console.log("Response sent successfully");
    return response;
  } catch (error) {
    console.error("Bot webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram bot webhook is ready",
    endpoint: "/api/bot",
    commands: ["/start", "/help"],
    instructions: "Make sure webhook is set to: https://r1otraw-71.vercel.app/api/bot"
  });
}