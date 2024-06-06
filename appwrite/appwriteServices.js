const { Client, Databases, Query, ID } = require('appwrite')
const config = require('../envConfig')


class AppwriteServices {
    client = new Client;
    database;

    constructor() {
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId);

        this.database = new Databases(this.client)
    }

    async createUser(chat_id, name) {
        try {
            return await this.database.createDocument(
                config.appwriteDatabaseId,
                config.userCollectionId,
                ID.unique(), {
                chat_id,
                name
            }
            )
        }
        catch (error) {
            console.log("errro on create user")
        }
    }

    async getUsers(chat_id) {
        const query = [Query.equal('chat_id', chat_id)]
        try {
            return await this.database.listDocuments(
                config.appwriteDatabaseId,
                config.userCollectionId,
                query
            )
        }
        catch (error) {
            console.log("errro on get user")
        }
    }

    async getAllUsers() {
        try {
            return await this.database.listDocuments(
                config.appwriteDatabaseId,
                config.userCollectionId
            )
        }
        catch (error) {
            console.log("errro on create user")
        }
    }


    async receivedMessage({ type, file_id, secretKey, chat_id, name }) {
        try {
            return this.database.createDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                ID.unique(), {
                type,
                file_id,
                secretKey,
                chat_id,
                name
            }
            )

        }
        catch (error) {
            console.log('erro on appwrite')
            throw error
        }
    }
    async getuserMessage(id) {
        try {
            const u = await this.database.getDocument(config.appwriteDatabaseId, config.appwriteCollectionId, id)
            console.log(u)
        }
        catch (err) {
            console.log(err)
        }
    }

    async getUserMsgByQuery(attrirute, key) {
        const query = [Query.equal(attrirute, key)]
        try {
            return await this.database.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                query
            )
        }
        catch (err) {
            throw err
        }
    }

    async deleteUserMsg(id) {
        try {
            await this.database.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                id
            )
            return true;
        }
        catch (err) {
            throw err
        }
    }
}
const appwriteServices = new AppwriteServices;
module.exports = appwriteServices;
// appwriteServices.getuserMessage('6653feb8000e977cec70')
//appwriteServices.receivedMessage({type:'naem',file_id:"jkhjhf",name:'jkjjhjkf',chat_id:'898',secretKey:'jkhjkhf'})

