process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const phrases = require('./phrases');
const getArticles = require('./lib/axios-requests/forum');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// phrases = {'вов'}, {'ла2'}, {'линейка'}

const mealTime = ['11:45', '11:50'];
const mealOrder = ['16:30', '17:01'];

function randomAnswer(ar) {
    const number = Math.floor((Math.random() * ar.length));
    const text = ar[number];
    return text;
}

bot.on('message', (msg) => {
    console.log(msg);
    for (let i = 0; i < phrases.length; i++) {
        for (let j = 0; j < phrases[i].keys.length; j++) {
            const regex = new RegExp(`(^|\\s|,)${phrases[i].keys[j]}(\\s|$|,|\\.|\\?|\\!)`, 'ig');
            if (regex.test(msg.text)) {
                bot.sendMessage(msg.chat.id, randomAnswer(phrases[i].answers));
                break;
            }
        }
    }
});

bot.onText(/\/news (.+)/, async (msg, match) => {
    const articles = await getArticles();
    const values = Object.values(articles);
    let answer = 'Вот:\r\n';
    if (match[1].toLowerCase() === 'all') {
        for (let i = 0; i < 10; i++) {
            answer += `[${values[i].innerHTML}]`;
            answer += `(https://www.overclockers.ua${values[i].href})\r\n`;
        }
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN', disable_web_page_preview: true });
    } else {
        const articleNumber = parseInt(match[1], 10);
        answer += `[${values[articleNumber - 1].innerHTML}]`;
        answer += `(https://www.overclockers.ua${values[articleNumber - 1].href})\r\n`;
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN' });
    }
});

setInterval(() => {
    for (let i = 0; i < mealTime.length; i++) {
        const curDate = `${new Date().getHours()}:${new Date().getMinutes()}`;
        if (mealOrder[i] === curDate) {
            bot.sendMessage(process.env.orbitalChatId, 'Еду закажите!!!');
        }
        if (mealTime[i] === curDate) {
            bot.sendMessage(process.env.orbitalChatId, '@Melor1n, набери за хавчик!');
        }
    }
}, 60000);
