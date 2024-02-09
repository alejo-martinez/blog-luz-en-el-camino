import { AudioManager } from "../dao/class/audioManager.js";
import { PdfManager } from "../dao/class/pdfManager.js";
import { UserManager } from "../dao/class/userManager.js";

import utils from "../utils.js";
import { VideoManager } from "../dao/class/videoManager.js";

const register = async (req, res) => {
    res.render('register');
}

const login = async (req, res) => {
    res.render('login');
}

const home = async (req, res) => {
    const userLogued = req.user;
    const admin = 'admin';
    const client = 'client';

    if (userLogued && userLogued.rol === client) res.render('home', { userLogued });
    if (userLogued && userLogued.rol === admin) res.render('home', { userLogued, admin });
    if (!userLogued) res.render('home');
}

const book = async (req, res) => {
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const libro = await PdfManager.getOne('category', 'libro');

    if (!userlogued) res.render('libro', { libro });
    else {
        if (req.user.rol === client) {
            res.render('libro', { userlogued, libro });
        }
        if (req.user.rol === admin) {
            res.render('libro', { admin, userlogued, libro });
        }
    }
}

const audios = async (req, res) => {
    const { page = 1 } = req.query;
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const response = await AudioManager.getAll(page);
    const range = 2;
    const pagesToRender = [];
    const url= '/audios'

    const audios = response.docs.map(audio => ({
        ...audio,
        title: audio.title.charAt(0).toUpperCase() + audio.title.slice(1),
        comments: audio.comments?.slice(-3)
    }));

    audios.forEach(audio => {
        if (audio.comments.length === 0) return;
        else {
            audio.comments.forEach(coment => {
                coment.comment.created_at = utils.formatDate(coment.comment.created_at);
            })
        }
    })


    for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
        pagesToRender.push(i);
    }

    const backPages = pagesToRender.filter(p => p < page);
    const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

    const objResponse = { audios, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, url }

    if (!userlogued) res.render('audios', objResponse);
    else {
        objResponse.userlogued = userlogued;
        if (req.user.rol === client) {

            res.render('audios', objResponse);
        }
        if (req.user.rol === admin) {
            objResponse.admin = admin;
            res.render('audios', objResponse);
        }
    }
}


const renderPdfByCategory = async (req, res, next) => {
    const userlogued = req.user;
    const { page = 1 } = req.query;
    const { cat } = req.params;
    const admin = 'admin';
    const client = 'client';
    const response = await PdfManager.getByCategory(cat, page);
    const categoryImgs = { 'lo-que-somos': '/static/images/dosmanos.webp', 'el-camino-de-la-sanacion': '/static/images/mirandoalcielo.webp', 'nobles-verdades': '/static/images/mandalaazul.webp', 'escritos-con-magia': '/static/images/duendesobremano.webp' };
    const range = 2;
    const pagesToRender = [];
    const url= `/category/${cat}`

    const categoryImage = categoryImgs[cat];

    const escritos = response.pdfs.map(pdf => ({
        ...pdf,
        title: pdf.title.charAt(0).toUpperCase() + pdf.title.slice(1),
        comments: pdf.comments.slice(-3)
    }));

    escritos.forEach(pdf => {
        if (pdf.comments.length !== 0) {
            pdf.comments.forEach(coment => {
                coment.comment.created_at = utils.formatDate(coment.comment.created_at);
            })
        }
    })

    for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
        pagesToRender.push(i);
    }

    const backPages = pagesToRender.filter(p => p < page);
    const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

    const objResponse = { escritos, categoryImage, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, cat: cat, url }

    if (!userlogued) res.render('showpdfs', objResponse);
    else {
        objResponse.userlogued = userlogued;
        if (req.user.rol === client) {
            res.render('showpdfs', objResponse);
        }
        if (req.user.rol === admin) {
            objResponse.admin = admin;
            res.render('showpdfs', objResponse);
        }
    }
}

const allVideos = async (req, res, next) => {
    try {
        const userLogued = req.user;
        const { page = 1 } = req.query;
        const response = await VideoManager.getAll(page);
        const range = 2;
        const pagesToRender = [];
        const videos = response.docs?.map(video => ({
            ...video,
            title: video.title.charAt(0).toUpperCase() + video.title.slice(1),
        }));
        const url= '/videos'

        for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
            pagesToRender.push(i);
        }

        const backPages = pagesToRender.filter(p => p < page);
        const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

        const objResponse = { videos, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, url }

        if (!userLogued) res.render('videos', objResponse)
        else {
            objResponse.userLogued = userLogued;
            if (userLogued && userLogued.rol === 'admin') {
                const admin = true;
                objResponse.admin = admin;
                res.render('videos', objResponse)
            }
            if (userLogued && userLogued.rol === 'client') {
                const client = true;
                objResponse.client = client;
                res.render('videos', objResponse)
            }
        }
    } catch (error) {
        next(error);
    }
}

const uploadpdf = async (req, res) => {
    const {page=1} = req.query;
    const user = req.user;
    const admin = true;
    const range = 2;
    const pagesToRender = [];
    const response = await PdfManager.getAll(page);
    for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
        pagesToRender.push(i);
    }

    const backPages = pagesToRender.filter(p => p < page);
    const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

    const url = '/uploadpdf'
    const objResponse = {pdfs: response.docs, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, user, admin, url}

    res.render("uploadpdf", objResponse);
}

const uploadaudio = async (req, res) => {
    const {page=1} = req.query;
    const user = req.user;
    const admin = true;
    const pagesToRender = [];
    const range = 2;
    const response = await AudioManager.getAll(page);
    for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
        pagesToRender.push(i);
    }

    const backPages = pagesToRender.filter(p => p < page);
    const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

    const url = '/uploadaudio'
    const objResponse = {audios: response.docs, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, user, admin, url}

    res.render("uploadaudio", objResponse);
}

const uploadvideo = async(req, res)=>{
    const {page=1} = req.query;
    const user = req.user;
    const admin = true;
    const pagesToRender = [];
    const range = 2;
    const response = await VideoManager.getAll(page);
    for (let i = Math.max(1, page - range); i <= Math.min(response.totalPages, page + range); i++) {
        pagesToRender.push(i);
    }

    const backPages = pagesToRender.filter(p => p < page);
    const nextPages = pagesToRender.filter(p => p > page).slice(0, range);

    const url = '/uploadvideo';
    const objResponse = {videos: response.docs, hasPrevPage: response.hasPrevPage, hasNextPage: response.hasNextPage, prevPage: response.prevPage, nextPage: response.nextPage, totalPages: response.totalPages, page, nextPages, backPages, user, admin, url}

    res.render("uploadvideo", objResponse);
}

const fileDetails = async (req, res, next) => {
    try {
        const { file, id } = req.params;
        const userLogued = req.user;
        const admin = 'admin';
        const client = 'client';
        let pdf;
        let audio;
        let video;
        let dataFile;
        if (file === 'pdf') {
            dataFile = await PdfManager.getById(id);
            pdf = true;
        }
        if (file === 'audio') {
            dataFile = await AudioManager.getById(id);
            audio = true;
        }
        if( file === 'video'){
            dataFile = await VideoManager.getById(id);
            video = true;
        }
        if (dataFile.comments.length !== 0) {
            dataFile.comments.forEach(coment => coment.comment.created_at = utils.formatDate(coment.comment.created_at))
        }
        if (userLogued && userLogued.rol === admin) res.render('details', { file, userLogued, admin, dataFile, pdf, audio, video });
        if (userLogued && userLogued.rol === client) res.render('details', { file, userLogued, client, dataFile, pdf, audio, video });
        if (!userLogued) res.render('details', { file, dataFile, pdf, audio, video });
    } catch (error) {
        next(error);
    }
}


const chat = async (req, res) => {
    const user = req.user;
    const users = await UserManager.getAll();
    let usersChatsFiltered = [];
    users.forEach(usuario => {
        if (usuario.chat.length === 0) return;
        else {
            usersChatsFiltered.push(usuario);
        }
    })
    if (user.rol === 'client') {
        const userChat = await UserManager.getById(user._id);

        usersChatsFiltered = usersChatsFiltered.filter(usuario => usuario._id != user._id);
        const client = true;
        res.render('charlas', { user, userChat, usersChatsFiltered, client });
    } else {
        const admin = true;
        res.render('charlas', { user, usersChatsFiltered, admin });
    }
}

const enviarMail = async (req, res) => {
    res.render('sendmailreset')
}

const resetPassword = async (req, res) => {
    const uid = req.params;
    res.render('resetpassword', { uid });
}

export default { register, login, home, book, audios, uploadpdf, uploadaudio, uploadvideo, chat, enviarMail, resetPassword, renderPdfByCategory, fileDetails, allVideos };