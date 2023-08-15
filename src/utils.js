import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import nodemailer from 'nodemailer';


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


// PDF
const pdfStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/pdfs`)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('El archivo debe ser un PDF.'), false);
    }
  };

const uploadPdf = multer({
    storage: pdfStorage,
    fileFilter: pdfFileFilter
});

// AUDIO
const audioStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/public/audios`);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const audioFileFilter = (req, file, cb)=>{
    if(file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav'){
        cb(null, true)
    } else{
        cb(new Error('El archivo debe ser un audio en formato MP3 o WAV.'), false);
    }
}

const uploadAudio = multer({
    storage : audioStorage,
    fileFilter: audioFileFilter
})


const transporte = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth:{
        user: config.adminEmail,
        pass: config.adminPassword
    }
})

const __dirname = dirname(__filename);

export default { generateToken, createHash, isValidPassword, cookieExtractor, transporte, uploadPdf, uploadAudio, __dirname };