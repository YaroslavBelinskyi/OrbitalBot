const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function getArticlesOvers() {
    try {
        const siteData = {
            articles: [],
            link: '',
        };
        const articlesPage = await axios.get('https://www.overclockers.ua/');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('#news ul li > a');
        const link = dom.window.document.querySelector('head meta[property="og:url"]').getAttribute('content');
        siteData.link = link;
        siteData.articles = articles;
        return siteData;
    } catch (error) {
        console.log(error);
    }
}

async function getArticlesFootball() {
    try {
        const siteData = {
            articles: [],
            link: '',
        };
        const articlesPage = await axios.get('https://football.ua/');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('.main-news li a');
        siteData.articles = articles;
        return siteData;
    } catch (error) {
        console.log(error);
    }
}

async function getArticlesPlayua() {
    try {
        const siteData = {
            articles: [],
            link: '',
        };
        const articlesPage = await axios.get('https://playua.net');
        const { data } = articlesPage;
        const dom = new JSDOM(data);
        const articles = dom.window.document.querySelectorAll('.short-article h3 a');
        siteData.articles = articles;
        return siteData;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getArticlesOvers, getArticlesFootball, getArticlesPlayua,
};
