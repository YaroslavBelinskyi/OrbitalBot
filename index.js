process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const phrases = require('./phrases');
const { getArticlesOvers, getArticlesFootball, getRandomBashJoke, } = require('./lib/axios-requests/forums');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// phrases = {'вов'}, {'ла2'}, {'линейка'}

const mealTime = ['11:45', '11:50'];
const mealOrder = ['16:30', '16:55'];

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

bot.onText(/\/news over (.+)/, async (msg, match) => {
    const articles = await getArticlesOvers();
    const values = Object.values(articles);
    let answer = 'Вот:\r\n';
    if (match[1].toLowerCase() === 'all') {
        for (let i = 0; i < 10; i++) {
            answer += `${i + 1}. [${values[i].textContent}]`;
            answer += `(https://www.overclockers.ua${values[i].href})\r\n`;
        }
        // const replyOptions = {
        //     reply_markup: {
        //         resize_keyboard: true,
        //         one_time_keyboard: true,
        //         keyboard: [
        //             ['yes'],
        //             ['no'],
        //         ],
        //     },
        // };
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN', disable_web_page_preview: true });
        // bot.sendMessage(msg.chat.id, 'Какую выберешь?', replyOptions);
    } else {
        const articleNumber = parseInt(match[1], 10);
        answer += `[${values[articleNumber - 1].textContent}]`;
        answer += `(https://www.overclockers.ua${values[articleNumber - 1].href})\r\n`;
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN' });
    }
});

bot.onText(/\/news fb (.+)/, async (msg, match) => {
    const articles = await getArticlesFootball();
    const values = Object.values(articles);
    let answer = 'Вот:\r\n';
    if (match[1].toLowerCase() === 'all') {
        for (let i = 0; i < 10; i++) {
            answer += `${i + 1}. [${values[i].innerHTML.trim()}]`;
            answer += `(${values[i].href})\r\n`;
        }
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN', disable_web_page_preview: true });
    } else {
        const articleNumber = parseInt(match[1], 10);
        answer += `[${values[articleNumber - 1].innerHTML.trim()}]`;
        answer += `(${values[articleNumber - 1].href})\r\n`;
        bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN' });
    }
});

bot.onText(/бот пошути/, async (msg) => {
    const joke = await getRandomBashJoke();
    console.log(joke);
    // const values = Object.values(joke);
    // console.log(values);
    const answer = joke.innerHTML.trim().replace(/<br>/gi, '\r\n').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>');
    bot.sendMessage(msg.chat.id, answer);
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
