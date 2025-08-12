import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';
import nodemailer from 'nodemailer';
import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';

const ffmpegService = ffmpeg.setFfmpegPath(ffmpegStatic);

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


export const client = new S3Client({
    region: config.awsregion,
    credentials: {
        accessKeyId: config.awsacceskey,
        secretAccessKey: config.awssecretkey
    }
})

//MULTER CONFIG

AWS.config.update({
    accessKeyId: config.awsacceskey,
    secretAccessKey: config.awssecretkey,
    region: 'us-east-2'
})

export const s3 = new AWS.S3({
    region: config.awsregion,
    credentials: {
        accessKeyId: config.awsacceskey,
        secretAccessKey: config.awssecretkey
    }
});



const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('El archivo debe ser un PDF.'), false);
    }
};

const uploadPdf = multer({
    storage: multer.memoryStorage(),
    fileFilter: pdfFileFilter
});



const audioFileFilter = (req, file, cb) => {
    if (file.mimetype === 'audio/mp4a-latm' || file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/wav' || file.mimetype === 'audio/x-wav') {
        cb(null, true)
    } else {
        cb(new Error('El archivo debe ser un audio en formato MP3 o WAV.'), false);
    }
}


const uploadAudio = multer({
    storage: multer.memoryStorage(),
    // fileFilter: audioFileFilter
});

const videoFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/webm' || file.mimetype === 'video/quicktime') {
        cb(null, true);
    } else {
        cb(new Error('El formato proporcionado para el video no es válido. Formatos aceptados: MP4, WebM o QuickTime'), false);
    }
}

const uploadVideo = multer({
    storage: multer.memoryStorage(),
    fileFilter: videoFilter,
})

const transporte = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.adminEmail,
        pass: config.nodemailerPass
    }
})

const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
};

const newFormDate = (date) => {
    return `${date.created_at.getDate()}/${date.created_at.getMonth() + 1}/${date.created_at.getFullYear()} ${String(date.created_at.getHours()).padStart(2, '0')}:${String(date.created_at.getMinutes()).padStart(2, '0')}`
}

const __dirname = dirname(__filename);

const cleanUpFiles = (files) => {
    files.forEach(file => {
        fs.unlink(file, (err) => {
            if (err) {
                console.error(`Error al eliminar ${file}:`, err);
            } else {
                console.log(`[${new Date().toLocaleString()}] - Archivo eliminado: ${file}`);
            }
        });
    });
};

export default { generateToken, createHash, isValidPassword, cookieExtractor, formatDate, transporte, uploadPdf, uploadAudio, uploadVideo, __dirname, newFormDate, ffmpegService, cleanUpFiles };