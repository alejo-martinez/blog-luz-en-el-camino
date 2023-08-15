import { PdfManager } from "../dao/class/pdfManager.js";
import utils from "../utils.js";

const register = async(req, res)=>{
    res.render('register');
}

const login = async(req, res)=>{
    res.render('login');
}

const home = async(req, res)=>{
    const user = req.user;
    const admin = 'admin';
    const client = 'client';

    if(!user) res.render('home');
    else{
        if(user.rol === client ) res.render('home', {user});
        if(user.rol === admin) res.render('adminhome', {user});
    }
}

const detalles = async(req, res)=>{
    res.render('details')
}

const book = async(req, res)=>{
    const libro = await PdfManager.getOne('category', 'libro');
    res.render('libro', {libro});
}

const audios = async(req, res)=>{
    res.render('audios');
}

const withmagic = async(req, res)=>{
    const escritos = await PdfManager.getByCategory('escritos con magia');
    res.render("escritosconmagia", {escritos});
}

const roadsanity = async(req, res)=>{
    res.render("caminodelasanacion");
}

const weare = async(req, res)=>{
    res.render("loquesomos")
}

const trues = async(req, res)=>{
    res.render("noblesverdades")
}

const uploadpdf = async(req, res)=>{
    const user = req.user;
    res.render("uploadpdf", {user});
}

const uploadaudio = async(req, res)=>{
    const user = req.user;
    res.render("uploadaudio", {user});
}

export default {register, login, home, detalles, book, audios, withmagic, roadsanity, weare, trues, uploadpdf, uploadaudio};