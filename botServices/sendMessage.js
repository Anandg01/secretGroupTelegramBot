const bot = require('../util/telegramBot');

const sendMessage = (id, type, message, caption) => {
    switch (type) {
        case 'photo':
            return bot.sendPhoto(id, message, { caption: caption })
        case 'video':
            return bot.sendVideo(id, message, { caption: caption })
        case 'document':
            return bot.sendDocument(id, message, { caption: caption })
        case 'text':
            return bot.sendMessage(id, message)
    }

}


module.exports = { sendMessage };