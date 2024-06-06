require('dotenv').config();

const config={
    appwriteUrl: String(process.env.APPWRITE_URL),
    appwriteProjectId: String(process.env.APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(process.env.APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(process.env.APPWRITE_COLLECTION_ID),
    telegramToken:String(process.env.TELEGRAM_TOKEN),
    userCollectionId:String(process.env.APPWRITE_USER_COLLECTION_ID),
    port:process.env.PORT
}

module.exports = config;