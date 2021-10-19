var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '2096759237:AAEETmtWsXDcQKJsYtSWGlC29S-XglZsgzs'
const bot = new TelegramBot(token, {polling: true});

// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        Selamat datang di TA islahuddin
        click /predict`
    );   
});

state = 0
bot.onText(/\/predict/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `input nilai S|K contohnya 30|200`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        S = s [0]
        O = s [1]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
            ]
        ).then((jres)=>{
            console.log(jres);
            bot.sendMessage(
                msg.chat.id,
                `nilai pompa yang diprediksi adalah ${jres [0]} `
                
            ); 
            bot.sendMessage(
                msg.chat.id,
                `nilai kipas yang diprediksi adalah ${jres [1]} `
            );
        })
    }else{
        state = 0
    }
})
// routers
r.get('/prediction/:S/:K', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.S), // string to float
            parseFloat(req.params.K)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;

