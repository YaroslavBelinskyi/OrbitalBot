process.env["NTBA_FIX_319"] = 1
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

// phrases = [{'виноват'}, {'горит'}, {'горю'}, {'должен'}, {'должны'}, {'вов'}, {'ла2'}, {'линейка'}, {'тест'}]

phrases = [
    {
        keys: ['виноват', 'виноваты',],
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
        keys: ['горит', 'горю', 'гориш', 'горим',],
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
        keys: ['тест', 'тестируем', 'тестим', 'тесты',],
        answers: [
            'Хуест!',
            'Очко себе протестируй, пёс!',
            'Тестировщик дохуя?',
            'Самый умный тут?',
            'Сестру твою тестирую, ага...',
        ],
    },
]

const mealTime = ['11:17', '11:19']
const orbitalChatId = -229085973;

function randomAnswer(ar) {
    const number = Math.floor((Math.random() * ar.length));
    const text = ar[number];
    return text;
}

bot.on('message', (msg) => {
    for (let i = 0; i < phrases.length; i++) {
        for (let j = 0; j < phrases[i].keys.length; j++) {
            if (msg.text.indexOf(phrases[i].keys[j]) >= 0) {
                bot.sendMessage(msg.chat.id, randomAnswer(phrases[i].answers));
                break
            }
        }
    }
});

// bot.on('message', function (msg) {
//     const chatId = msg.chat.id;
//     if (msg.text.indexOf('виноват') >= 0) {
//         bot.sendMessage(chatId, 'Димася, сука, виноват!');
//     }
//     if (msg.text.indexOf('горит') >= 0 || msg.text.indexOf('горю') >= 0) {
//         bot.sendMessage(chatId, 'Че пичот?');
//     }
//     if (msg.text.indexOf('должен') >= 0 || msg.text.indexOf('должны') >= 0) {
//         bot.sendMessage(chatId, 'Попроще будь, он или я или ты кому-то чето обещал?!');
//     }
// });


setInterval(function(){
    for (let i = 0; i < mealTime.length; i++){
        const curDate = new Date().getHours() + ':' + new Date().getMinutes();
            if (mealTime[i] == curDate) {
                bot.sendMessage(orbitalChatId, 'Еду закажите!!!');
            }
        }
}, 60000);