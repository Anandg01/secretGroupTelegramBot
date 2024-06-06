const telegramBot=require('node-telegram-bot-api')
const config=require('../envConfig')
const bot=new telegramBot(config.telegramToken,{polling:true})

module.exports=bot;