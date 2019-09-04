process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const phrases = require('./phrases');
const {
    getArticlesOvers, getArticlesFootball, getArticlesPlayua, getRandomJoke, getRandomJokeWowlol,
} = require('./lib/axios-requests/forums');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    try {
        function randomAnswer(ar) {
            const number = Math.floor((Math.random() * ar.length));
            const text = ar[number];
            return text;
        }
        console.log(msg);
        for (let i = 0; i < phrases.length; i++) {
            for (let j = 0; j < phrases[i].keys.length; j++) {
                const regex = new RegExp(`(^|\\s|,)${phrases[i].keys[j]}(\\s|$|,|\\.|\\?|\\!)`, 'ig');
                const lowText = msg.text.toLowerCase();
                if (regex.test(lowText)) {
                    if (phrases[i].answers) {
                        bot.sendMessage(msg.chat.id, randomAnswer(phrases[i].answers));
                        break;
                    } else {
                        const percentage = Math.floor(Math.random() * Math.floor(100) + 1);
                        bot.sendMessage(msg.chat.id, `Я бы сказал ${percentage}%.`);
                        break;
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/\/news (.+)/, async (msg, match) => {
    try {
        let siteData;
        let site;
        if (match[1].toLowerCase() === 'over') {
            siteData = await getArticlesOvers();
            site = 'over';
        } else if (match[1].toLowerCase() === 'fb') {
            siteData = await getArticlesFootball();
            site = 'fb';
        } else if (match[1].toLowerCase() === 'play') {
            siteData = await getArticlesPlayua();
            site = 'play';
        }
        const values = Object.values(siteData.articles);
        let answer = 'Вот:\r\n';
        let len = 10;
        if (values.length < 10) {
            len = values.length;
        }
        for (let i = 0; i < len; i++) {
            answer += `${i + 1}. [${values[i].textContent.trim()}]`;
            answer += `(${siteData.link}${values[i].href})\r\n`;
        }
        const callBackData = [];
        (function dataGenerator() {
            for (let i = 0; i < 12; i++) {
                callBackData.push(JSON.stringify({ env: site, pos: i }));
            }
        }());
        const replyOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '1', callback_data: callBackData[0] }, { text: '2', callback_data: callBackData[1] }, { text: '3', callback_data: callBackData[2] }],
                    [{ text: '4', callback_data: callBackData[3] }, { text: '5', callback_data: callBackData[4] }, { text: '6', callback_data: callBackData[5] }],
                    [{ text: '7', callback_data: callBackData[6] }, { text: '8', callback_data: callBackData[7] }, { text: '9', callback_data: callBackData[8] }],
                    [{ text: '10', callback_data: callBackData[9] }, { text: 'Random', callback_data: callBackData[10] }, { text: 'Cancel', callback_data: callBackData[11] }],
                ],
            },
        };
        await bot.sendMessage(msg.chat.id, answer, { parse_mode: 'MARKDOWN', disable_web_page_preview: true });
        await bot.sendMessage(msg.chat.id, `@${msg.from.username}, какую выберешь?`, replyOptions);
    } catch (error) {
        console.log(error);
    }
});

bot.on('callback_query', async (msg) => {
    try {
        const data = JSON.parse(msg.data);
        const position = data.pos;
        const environment = data.env;
        let siteData;
        if (environment === 'over') {
            siteData = await getArticlesOvers();
        } else if (environment === 'fb') {
            siteData = await getArticlesFootball();
        } else if (environment === 'play') {
            siteData = await getArticlesPlayua();
        }
        const values = Object.values(siteData.articles);
        let answer = '';
        if (position === 11) {
            answer = 'Ну и пошел ты нахуй!';
            const opts = {
                chat_id: msg.message.chat.id,
                message_id: msg.message.message_id,
            };
            bot.editMessageText(answer, opts);
        } else {
            let articleNumber = parseInt(position, 10);
            if (position === 10) {
                articleNumber = Math.floor(Math.random() * values.length);
            }
            if (!values[articleNumber]) {
                bot.sendMessage(msg.message.chat.id, 'Такого номера в списке нет, ты что слепой, псина?', { parse_mode: 'MARKDOWN' });
            } else {
                answer += `[${values[articleNumber].textContent}]`;
                answer += `(${siteData.link}${values[articleNumber].href})\r\n`;
                bot.sendMessage(msg.message.chat.id, answer, { parse_mode: 'MARKDOWN' });
            }
        }
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/бот пошути/i, async (msg) => {
    try {
        const joke = await getRandomJoke();
        const answer = joke.innerHTML.trim().replace(/<br>/gi, '\r\n');
        bot.sendMessage(msg.chat.id, answer);
    } catch (error) {
        console.log(error);
    }
});

bot.onText(/вовлол/i, async (msg) => {
    try {
        const jokeObj = await getRandomJokeWowlol();
        let text = jokeObj.innerHTML.replace(/<br>/gi, '\r').replace(/(?=<).*/gi, '').trim();
        let picture = '';
        if (text === null) {
            text = 'Там хуевый пост был, я ебал его парсить.';
        }
        if (jokeObj.querySelector('img')) {
            picture = jokeObj.querySelector('img').src;
        }
        if (picture !== null) {
            bot.sendPhoto(msg.chat.id, picture, { caption: text });
        } else {
            bot.sendMessage(msg.chat.id, text);
        }
    } catch (error) {
        console.log(error);
    }
});
