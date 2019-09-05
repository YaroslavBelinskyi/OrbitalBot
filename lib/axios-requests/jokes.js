const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function getRandomJoke() {
    try {
        const jokesPage = await axios.get('https://www.anekdot.ru/random/anekdot/');
        const { data } = jokesPage;
        const dom = new JSDOM(data);
        const joke = dom.window.document.querySelector('.topicbox:nth-of-type(2) .text');
        return joke;
    } catch (error) {
        console.log(error);
    }
}

async function getRandomJokeWowlol() {
    try {
        const jokesPage = await axios.get('https://wowlol.ru/random');
        const { data } = jokesPage;
        const dom = new JSDOM(data);
        const jokeObj = dom.window.document.querySelector('.block:nth-of-type(2) .binner');
        return jokeObj;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRandomJoke, getRandomJokeWowlol,
};
