import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI || '_MONGODB_URI_',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};