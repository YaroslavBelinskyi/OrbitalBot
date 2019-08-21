const axios = require('axios');
// const $ = require('jquery');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function getArticlesOvers() {
    try {
        const articlesPage = await axios.get('https://www.overclockers.ua/');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('#news ul li > a ');
        return articles;
    } catch (error) {
        console.log(error);
    }
}

async function getArticlesFootball() {
    try {
        const articlesPage = await axios.get('https://football.ua/');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('.main-news li a');
        return articles;
    } catch (error) {
        console.log(error);
    }
}
getArticlesFootball();

async function getRandomBashJoke() {
    try {
        const jokesPage = await axios.get('https://bash.im/random');
        const { data } = jokesPage;
        const dom = new JSDOM(data);
        const joke = dom.window.document.querySelector('.quote:first-of-type div > div');
        return joke;
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getArticlesOvers, getArticlesFootball, getRandomBashJoke };
