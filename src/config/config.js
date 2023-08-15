import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    secret: process.env.SECRET,
    cookieCode: process.env.COOKIE_CODE,
    privateKey: process.env.PRIVATE_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
}