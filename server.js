const express = require('express');
const jsdom = require("jsdom");
const rp = require('request-promise');
const r = require('request');
const { get } = require('cheerio/lib/api/traversing');

const port = process.env.PORT || 80;

const app = express();

app.listen(port, () => {
    console.log('started')
})

function getEURValue() {
    const url = `https://myfin.by/currency/mogilev`;
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




app.get('/start', (req, res) => {
    sendNotification('start');
});

app.get('/', (req, res) => {
    getEURValue().then(res => {
        sendNotification(res);
    })
    res.end(`
    <h1>HELLLLLLO</h1>
    `)
});

function startEnterval() {
    
}

app.get('/end', (req, res) => {
    sendNotification('end');
})