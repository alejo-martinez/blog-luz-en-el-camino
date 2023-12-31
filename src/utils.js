import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer, { memoryStorage } from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';



const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['accesToken']
    }
    return token;
}

const generateToken = (user) => {
    const token = jwt.sign({ user }, config.privateKey, { expiresIn: '24h' });
    return token;
}

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

const __filename = fileURLToPath(import.meta.url);

//MULTER CONFIG

AWS.config.update({
    accessKeyId: config.awsacceskey,
    secretAccessKey: config.awssecretkey,
    region: 'us-east-2'
})

export const s3 = new AWS.S3();



// const s3client = new S3Client({
//     region:'us-east-2',
//     credentials:{
//         accessKeyId: config.awsacceskey,
//         secretAccessKey: config.awssecretkey,
//     }
// })

// aws.config.update({
//     accessKeyId: config.awsacceskey,
//     secretAccessKey: config.awssecretkey,
//     region:'us-east-2'
// })

// const s3 = new aws.S3();
// console.log(s3);

// PDF
// const pdfStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, `${__dirname}/public/pdfs`)
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('El archivo debe ser un PDF.'), false);
    }
  };

const uploadPdf = multer({
    storage: multer.memoryStorage(),//pdfStorage,
    fileFilter: pdfFileFilter
});

// AUDIO
// const audioStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, `${__dirname}/public/audios`);
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname)
//     }
// })

const audioFileFilter = (req, file, cb)=>{
    if(file.mimetype === 'audio/mp4a-latm' || file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav'){
        cb(null, true)
    } else{
        cb(new Error('El archivo debe ser un audio en formato MP3 o WAV.'), false);
    }
}

// const uploadAudio = multer({
//     storage : multerS3({
//         s3: s3,
//         bucket:'luzenelcamino',
//         acl: 'public-read',
//         // metadata: function (req, file, cb) {
//         //     console.log(file.fieldname);
//         //     cb(null, {fieldName: file.fieldname});
//         //   },
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//           key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname);
//           }
//     }),
//     //fileFilter: audioFileFilter
// })

const uploadAudio = multer({
    storage : multer.memoryStorage(),//audioStorage,
    fileFilter: audioFileFilter
})

const transporte = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth:{
        user: config.adminEmail,
        pass: config.nodemailerPass
    }
})

const formatDate = (date)=> {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const __dirname = dirname(__filename);

export default { generateToken, createHash, isValidPassword, cookieExtractor, formatDate, transporte, uploadPdf, uploadAudio, __dirname };