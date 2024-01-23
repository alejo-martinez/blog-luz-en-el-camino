// MODULOS
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import handlebars from 'express-handlebars';
import session from 'express-session';
import passport from 'passport';
import {Server} from 'socket.io';
import MongoStore from 'connect-mongo';

//CONFIG
import config from './config/config.js';
import initPassport from './config/passport.config.js';

import utils from './utils.js';

import sessionRouter from './routes/session.router.js';
import pdfRouter from './routes/pdf.router.js';
import audioRouter from './routes/audio.router.js';
import messageRouter from './routes/message.router.js';
import suggestRouter from './routes/suggest.router.js';
import viewsRouter from './routes/views.router.js';
import userRouter from './routes/user.router.js';
import comentRouter from './routes/coment.router.js';

import handleErrors from './middlewares/error.middleware.js';
import { PdfManager } from './dao/class/pdfManager.js';
import { AudioManager } from './dao/class/audioManager.js';
import { ComentManager } from './dao/class/comentManager.js';


const app = express();

const httpServer = app.listen(parseFloat(config.port), ()=> console.log(`server arriba en el puerto: ${config.port}`))

export const io = new Server(httpServer);

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoURL,
        mongoOptions:{useNewUrlParser: true},
        ttl:20
    }),
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}))

initPassport();

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser(config.cookieCode));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/static', express.static(utils.__dirname + '/public'));
app.use(express.static(path.join(utils.__dirname, 'views')));
app.use(express.static(utils.__dirname + '/public'))

//RUTAS
app.use('/api/pdf', pdfRouter);
app.use('/api/audio', audioRouter);
app.use('/api/message', messageRouter);
app.use('/api/session', sessionRouter);
app.use('/api/suggest', suggestRouter);
app.use('/api/comment', comentRouter);
app.use('/api/user', userRouter);
app.use('/', viewsRouter);


app.engine('handlebars', handlebars.engine());

app.set('views', utils.__dirname + '/views');
app.set('view engine', 'handlebars');


io.on('connection', async(socket)=>{
    console.log("Conectado al servidor");

    socket.on('comment', async(data)=>{
        const date = new Date();
        const newData = {name: data.name, text: data.text, created_at: utils.formatDate(date)};
        await PdfManager.coment(data.name, data.text, data.id);
        const pdf = await PdfManager.getById(data.id);
        await utils.transporte.sendMail({to:config.adminEmail, sender:config.adminEmail, subject:'Un pdf ha sido comentado', text:`El pdf "${pdf.title}" recibió un comentario.`})
        io.emit('comment', newData)
    })

    socket.on('audiocomment', async(data)=>{
        const date = new Date();
        // const newData = {name: data.name, text: data.text, created_at: utils.formatDate(date)};
        await AudioManager.coment(data.name, data.text, data.id);
        const audio = await AudioManager.getById(data.id);
        // await utils.transporte.sendMail({to: config.adminEmail, sender: config.adminEmail, subject: 'Un audio ha sido comentado', text: `El audio "${audio.title}" recibió un comentario`});
        io.emit('audiocomment', newData);
    })
});


mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(handleErrors);