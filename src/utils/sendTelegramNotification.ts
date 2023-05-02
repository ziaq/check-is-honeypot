import { Telegraf } from 'telegraf';
import config from '../../config/config';
import logger from './logger';

const bot = new Telegraf(config.telegramBotToken);
const TELEGRAM_CHAT_ID = config.telegramChatId;

const sendTelegramNotification = async (message: string): Promise<void> => {
  try {
    await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' });
  } catch (error) {
    logger.error('Can not send message to telegram');
  }
};

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default sendTelegramNotification;