const express = require('express');
const jsdom = require("jsdom");
const rp = require('request-promise');
const r = require('request');

const app = express();

function sendNotification() {
    const url = `https://myfin.by/currency/mogilev`;
    const botUrl = `https://api.telegram.org/bot5456371619:AAHSXc5X3WQc6Rdsp4JkTJfh11iSnK1lhFs/sendMessage?chat_id=735510453&text=`;
    const {
        JSDOM
    } = jsdom;
    global.dom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = dom.window;
    global.document = dom.window.document;
    global.navigator = global.window.navigator;
    const table = document.createElement("table");
    rp(url).then(async function (html) {
            table.innerHTML += html.split(/<\/?table>/)[1];
            const eurRate = table.querySelector('tbody tr:nth-child(2) td:nth-child(2)');
            console.log(`${botUrl}${eurRate.textContent}`);
            r.get({
                url: `${botUrl}${eurRate.textContent}`,
            }, (er, res) => {
                if(er) {
                    console.log(er);
                } else {
                    console.log(res);
                }
            });
        })
        .catch(function (err) {
            //handle error
        });
}


app.get('/start', (req, res) => {
    sendNotification();
});

function startEnterval() {

}

app.get('/end', (req, res) => {

})