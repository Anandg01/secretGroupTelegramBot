const express = require('express');
const config = require('./envConfig')
const bot = require('./util/telegramBot');
const appwriteService = require('./appwrite/appwriteServices')
const { sendMessage } = require('./botServices/sendMessage')
const app = express();

bot.onText(/\/start/, async (msg, match) => {
    const { id, first_name, last_name, is_Bot } = msg.from;
    const name = first_name.concat('', last_name ? last_name : '')
    if (is_Bot) return;
    try {
        const user = await appwriteService.getUsers(id);
        const { total } = user
        if (total == 0) {
            await appwriteService.createUser(id, name)
        }
        await bot.sendMessage(msg.chat.id, `Welcome, ghost 👻, to the SecretShare bot! Now you can share videos and photos anonymously.`)
    }
    catch (err) {
        return bot.sendMessage(msg.chat.id, `Somethig went wrong but, You don't worry you can access document and send document`)

    }
})

bot.on('message', async msg => {
    const { id, first_name, last_name, is_Bot } = msg.from;
    if (is_Bot) return;
    
    const name = first_name.concat(' ', last_name ? last_name : '');
    let secretKey = '';
    let file_id = '';
    let type = '';
    let message = '';
    try {
        const users = await appwriteService.getAllUsers();
        const userDocuments = users.documents;
        const totlaDocument = users.total;
        if (msg.text) {
            if(msg.text.includes('/start'))return;
            if(msg.text.includes('/key_'))return;
           return bot.sendMessage(id,'Only support video ,photo and doucumet')
        }
        else if (msg.photo) {
            type = "photo"
            file_id = msg.photo[0].file_id;
            const file_unique_id = msg.photo[0].file_unique_id;
            secretKey = file_unique_id.split('-').join('');
            message = msg.caption ? msg.caption : '';
        }
        else if (msg.video) {
            type = 'video'
            const { file_name, file_unique_id } = msg.video;
            message = msg.caption ? msg.caption : '';
            secretKey = file_name ? file_name.split('.')[0].slice(0, 7).toLowerCase() :
                file_unique_id.split('-').join('');
            file_id = msg.video.file_id;
        }
        else if (msg.document) {
            type = "document"
            const { file_name, file_unique_id } = msg.document;
            secretKey = file_name ? file_name.split('.')[0].slice(0, 7).toLowerCase() :
                file_unique_id.split('-').join('');
            file_id = msg.document.file_id;
            message = msg.caption ? msg.caption : '';
        }
        else {

        }

        userDocuments.forEach(user => {
            sendMessage(user.chat_id, type, file_id, message)
                .then(() => {
                    return;
                })
                .catch(() => {
                    return;
                })
        })

        await appwriteService.receivedMessage({ type, file_id, secretKey, chat_id: id, name })
        await bot.sendMessage(id, `Congratulations 🎉! Your ${type} has been uploaded. 
        You can now access it by using the secret key: "/key_${secretKey}",
    it accessible only some time `)
    }

    catch (error) {
        console.log(error)
        return bot.sendMessage(id, 'Something went wrong to sending video..')
    }
})

bot.onText(/\/key_(.+)/, async (msg, match) => {
    const { id: requestId, is_Bot } = msg.from;
    if (is_Bot) return;
    const secretKey = match[1].trim().toLowerCase();
    try {

        const messages = await appwriteService.getUserMsgByQuery('secretKey', secretKey);
        const totalDoc = messages.total;
        const documents = messages.documents;
        if (totalDoc <= 0) {
            return await bot.sendMessage(msg.chat.id, `We didn't find any documents with the key: "/key_${secretKey}" `)
        }
        await bot.sendMessage(requestId, `Available ${totalDoc} file with key "/key_${secretKey} "`)
        documents.forEach(async document => {
            const { type, file_id, $id } = document
            try {
                await sendMessage(requestId, type, file_id)
            }
            catch (err) {
                appwriteService.deleteUserMsg($id)
                    .then(bot.sendMessage(msg.chat.id, `${type} is deleted with ${secretKey}`))
                    .catch()
            }
        })
    }
    catch (error) {
        console.log("errro onText /key space", error);
        return bot.sendMessage(msg.chat.id, "Something went wrong for sending file")
    }
})

bot.onText(/\/findKey/, async (msg, match) => {
    const { id, is_Bot } = msg.from;
    if (is_Bot) return;
    try {
        const docs = await appwriteService.getUserMsgByQuery('chat_id', id)

        const doc = docs.documents.map(e => {
            return `/key_${e.secretKey}\n`
        })
        await bot.sendMessage(msg.chat.id, `All secret Keys of 
  your file and video ,
  Keys:
  ${doc}
   `, { parse_mode: 'HTML' })
    }
    catch (err) {
        console.log(err, 'etffhg')
        return;
    }

})

app.use('/', (req, res) => {
    res.send(`
        <h1 style="text-align: center;"> Telegram bot running
            <a href="https://t.me/secretSharebot"> telegram bot try it</a>
        </h1>`)
})

app.listen(config.port, () => console.log("server runnig..."))