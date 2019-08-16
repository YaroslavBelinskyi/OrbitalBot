const axios = require('axios');
const $ = require('jquery');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

async function getCarInfo() {
    try {
        const carInfo = await axios.get('https://www.overclockers.ua/games/');
        const { data } = carInfo;
        const dom = new JSDOM(data);
        console.log(dom.window.document.querySelector('#posts_ li:nth-of-type(1) a').textContent);
        return carInfo;
    } catch (error) {
        console.log(error);
    }
}
getCarInfo();

module.exports = getCarInfo;
