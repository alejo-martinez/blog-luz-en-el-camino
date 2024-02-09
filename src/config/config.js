import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    secret: process.env.SECRET,
    cookieCode: process.env.COOKIE_CODE,
    privateKey: process.env.PRIVATE_KEY,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    nodemailerPass: process.env.NODEMAILER_PASS,
    awsacceskey: process.env.AWS_ACCES_KEY,
    awssecretkey: process.env.AWS_SECRET_ACCESS_KEY,
    awsbucketaudios: process.env.AWS_BUCKET_AUDIO,
    awsbucketpdfs: process.env.AWS_BUCKET_PDF,
    awsbucketvideos: process.env.AWS_BUCKET_VIDEO,
    awsregion: process.env.AWS_REGION,
    adminId: process.env.USER_ID,
}