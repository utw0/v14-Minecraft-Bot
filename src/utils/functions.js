const moment = require("moment");
const mongoose = require('mongoose');
const config = require("../config");

module.exports = {
    execute: async (client) => {
        client.log = function (message) {
            console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${message}`);
        };

        const connectDB = async () => {
            try {
                await mongoose.connect(config.MongoDB, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                console.log('MongoDB başarıyla bağlandı!');
            } catch (error) {
                console.error('MongoDB bağlantı hatası:', error.message);
                process.exit(1);
            }
        };

        connectDB();
    }
}
