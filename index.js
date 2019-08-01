process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// phrases = {'вов'}, {'ла2'}, {'линейка'}

const phrases = [
    {
        keys: ['виноват', 'виноваты', 'виноватый', 'виновный', 'виновен'],
        answers: [
            'Димася, сука, виноват!',
            'Ууу сука, опять Димася!',
            'А то ты блять не знаешь кто...',
            'А ну, и кто же виноват?',
            'Димася, сколько можно?',
            'Все мы знает, кто виноват, а извиняться он будет?',
            'Ну да-да, не Димася, но блять он всеравно крайний!',
            'А давайте Димасю сделаем виноватым?',
        ],
    },
    {
        keys: ['горит', 'горю', 'гориш', 'горим'],
        answers: [
            'Че пичот?',
            'Ого пичёт!',
            'Гори-гори ясно!',
            'Ехехех че джуны пиздатые?',
            'Это опять все из-зи Димаси?',
            'УуЪу сука!!',
        ],
    },
    {
        keys: ['тест', 'тестируем', 'тестим', 'тесты'],
        answers: [
            'Хуест!',
            'Очко себе протестируй, пёс!',
            'Тестировщик дохуя?',
            'Самый умный тут?',
            'Сестру твою тестирую, ага...',
        ],
    },
    {
        keys: ['должен', 'обязан', 'должны', 'обязаны'],
        answers: [
            'Пффф кто-то кому-то что-то должен?',
            'Кому должен - всем прощаю!',
            'Никому ничем он или я или не обязян!',
            'Пппффф ага да, щас, бегу...',
            'Попроще будь, он или я или ты кому-то че-то обещал?!',
        ],
    },
    {
        keys: ['контент', 'кантент', 'кантента', 'контента'],
        answers: [
            'Хочешь контент - плати.',
            'Не хочешь контент - один хуй плати.',
            'Бабки давай и будет тебе кантент.',
            'Щас сборы поставим на кантентик!',
            'Будут деньги - будет контент.',
        ],
    },
    {
        keys: ['ты пидор'],
        answers: [
            'Сам такой!',
            'Нееее, Димася пидор!',
        ],
    },
];

const mealTime = ['11:45', '11:50'];
const mealOrder = ['16:30', '17:00'];

function randomAnswer(ar) {
    const number = Math.floor((Math.random() * ar.length));
    const text = ar[number];
    return text;
}

bot.on('message', (msg) => {
    for (let i = 0; i < phrases.length; i++) {
        for (let j = 0; j < phrases[i].keys.length; j++) {
            const regex = new RegExp(`(^|\\s|,)${phrases[i].keys[j]}(\\s|$|,|\\.|\\?|\\!)`, 'ig');
            console.log(msg);
            if (regex.test(msg.text)) {
                bot.sendMessage(msg.chat.id, randomAnswer(phrases[i].answers));
                break;
            }
        }
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
}, 50000);
