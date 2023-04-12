const express = require('express');
const jsdom = require("jsdom");
const rp = require('request-promise');
const r = require('request');
const TelegramApi = require('node-telegram-bot-api');

const token = "5456371619:AAHSXc5X3WQc6Rdsp4JkTJfh11iSnK1lhFs";

const port = process.env.PORT || 80;
const app = express();
const bot = new TelegramApi(token, {polling: true})

bot.on("message", msg => {
    const chat_id = msg.chat.id;
    const text = msg.text.toLocaleLowerCase();
    if (text === 'start') {
        getEURValue('mogilev').then(res => {
            bot.sendMessage(chat_id, res);
        })
    }
    else {
        getEURValue(text).then(res => {
            bot.sendMessage(chat_id, res);
        })
    }
})

app.listen(port, () => {
    console.log('started')
});

function getEURValue(city) {
    const url = `https://myfin.by/currency/${city}`;
    const {
        JSDOM
    } = jsdom;
    global.dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = global.window.navigator;
    const table = document.createElement("table");
    return rp(url).then(function (html) {
            table.innerHTML += html.split(/<\/?table>/)[1];
            const eurRate = table.querySelector('tbody tr:nth-child(2) td:nth-child(2)');
            return eurRate.textContent;
        })
        .catch(function (err) {
            //handle error
        });
}

function sendNotification(message) {
    const botUrl = `https://api.telegram.org/bot5456371619:AAHSXc5X3WQc6Rdsp4JkTJfh11iSnK1lhFs/sendMessage?chat_id=735510453&text=`;
    r.get({
        url: `${botUrl}${message}`,
    }, (er, res) => {});
}

app.get('/', (req, res) => {
    getEURValue('mogilev').then(res => {
        sendNotification(res);
    })
    res.end(`
    <h1>HELLLLLLO</h1>
    `)
});