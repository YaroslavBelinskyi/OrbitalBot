const axios = require('axios');
// const $ = require('jquery');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function getArticles() {
    try {
        const articlesPage = await axios.get('https://www.overclockers.ua/games/');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('#posts_ li a');
        console.log(typeof articles);
        return articles;
    } catch (error) {
        console.log(error);
    }
}
getArticles();

module.exports = getArticles;
