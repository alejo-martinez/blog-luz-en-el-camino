import { MessageManager } from "../dao/class/messageManager.js";
import { PdfManager } from "../dao/class/pdfManager.js";
import { pdfModel } from "../dao/models/pdf.model.js";
import utils from "../utils.js";

const register = async(req, res)=>{
    res.render('register');
}

const login = async(req, res)=>{
    res.render('login');
}

const home = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';

    if(!userlogued) res.render('home');
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('home', {userlogued});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('home', {adminUser, userlogued});
        } 
    }
}

const detalles = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';

    if(!userlogued) res.render('details');
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('details', {userlogued});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('details', {adminUser, userlogued});
        } 
    }
}

const book = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const libro = await PdfManager.getOne('category', 'libro');
    
    if(!userlogued) res.render('libro', {libro});
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('libro', {userlogued, libro});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('libro', {adminUser, userlogued, libro});
        } 
    }
}

const audios = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';

    if(!userlogued) res.render('audios');
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('audios', {userlogued});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('audios', {adminUser, userlogued});
        } 
    }
}

const withmagic = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const param = 'escritos con magia'
    const allpdfs = await PdfManager.getByCategory(param);
    const formatDate = allpdfs.map(pdf => ({
        ...pdf,
        comments: pdf.comments.map(coment => ({
            ...coment,
            created_at:`${coment.created_at.getDate()}/${coment.created_at.getMonth() + 1}/${coment.created_at.getFullYear()} ${String(coment.created_at.getHours()).padStart(2, '0')}:${String(coment.created_at.getMinutes()).padStart(2, '0')}`
        }))
    }))
    const escritos = formatDate.map(pdf => ({
        ...pdf,
        comments: pdf.comments.slice(-3)
      }));
  
      if(!userlogued) res.render('escritosconmagia', {escritos});
      else{
          if(req.user.rol === client ){
              const user = req.user;
              res.render('escritosconmagia', {userlogued, escritos});
          } 
          if(req.user.rol === admin){
              const adminUser = req.user;
              res.render('escritosconmagia', {adminUser, userlogued, escritos});
          } 
      }
}

const roadsanity = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const param = 'camino de la sanacion'
    const allpdfs = await PdfManager.getByCategory(param);
    const formatDate = allpdfs.map(pdf => ({
        ...pdf,
        comments: pdf.comments.map(coment => ({
            ...coment,
            created_at:`${coment.created_at.getDate()}/${coment.created_at.getMonth() + 1}/${coment.created_at.getFullYear()} ${String(coment.created_at.getHours()).padStart(2, '0')}:${String(coment.created_at.getMinutes()).padStart(2, '0')}`
        }))
    }))
    const escritos = formatDate.map(pdf => ({
        ...pdf,
        comments: pdf.comments.slice(-3)
      }));

    if(!userlogued) res.render('caminodelasanacion', {escritos});
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('caminodelasanacion', {userlogued, escritos});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('caminodelasanacion', {adminUser, userlogued, escritos});
        } 
    }
}

const weare = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const param = 'lo que somos'
    const allpdfs = await PdfManager.getByCategory(param);
    const formatDate = allpdfs.map(pdf => ({
        ...pdf,
        comments: pdf.comments.map(coment => ({
            ...coment,
            created_at:`${coment.created_at.getDate()}/${coment.created_at.getMonth() + 1}/${coment.created_at.getFullYear()} ${String(coment.created_at.getHours()).padStart(2, '0')}:${String(coment.created_at.getMinutes()).padStart(2, '0')}`
        }))
    }))
    const escritos = formatDate.map(pdf => ({
        ...pdf,
        comments: pdf.comments.slice(-3)
      }));

    if(!userlogued) res.render('loquesomos', {escritos});
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('loquesomos', {userlogued, escritos});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('loquesomos', {adminUser, userlogued, escritos});
        } 
    }
}

const trues = async(req, res)=>{
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const param = 'nobles verdades'
    const allpdfs = await PdfManager.getByCategory(param);
    const formatDate = allpdfs.map(pdf => ({
        ...pdf,
        comments: pdf.comments.map(coment => ({
            ...coment,
            created_at:`${coment.created_at.getDate()}/${coment.created_at.getMonth() + 1}/${coment.created_at.getFullYear()} ${String(coment.created_at.getHours()).padStart(2, '0')}:${String(coment.created_at.getMinutes()).padStart(2, '0')}`
        }))
    }))
    const escritos = formatDate.map(pdf => ({
        ...pdf,
        comments: pdf.comments.slice(-3)
      }));

    if(!userlogued) res.render('noblesverdades',{escritos});
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('noblesverdades', {userlogued, escritos});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('noblesverdades', {adminUser, userlogued, escritos});
        } 
    }
}

const uploadpdf = async(req, res)=>{
    const user = req.user;
    res.render("uploadpdf", {user});
}

const uploadaudio = async(req, res)=>{
    const user = req.user;
    res.render("uploadaudio", {user});
}

const pdfdetails = async(req, res)=>{
    const {pid} = req.params;
    const userlogued = req.user;
    const admin = 'admin';
    const client = 'client';
    const pdf = await PdfManager.getById(pid);
    const date = pdf.comments.map(coment => ({
        ...coment,
        created_at:`${coment.created_at.getDate()}/${coment.created_at.getMonth() + 1}/${coment.created_at.getFullYear()} ${String(coment.created_at.getHours()).padStart(2, '0')}:${String(coment.created_at.getMinutes()).padStart(2, '0')}`
    }))
    pdf.comments = date;
    if(!userlogued) res.render('details', {pdf});
    else{
        if(req.user.rol === client ){
            const user = req.user;
            res.render('details', {userlogued, pdf});
        } 
        if(req.user.rol === admin){
            const adminUser = req.user;
            res.render('details', {adminUser, userlogued, pdf});
        } 
    }
}

export default {register, login, home, detalles, book, audios, withmagic, roadsanity, weare, trues, uploadpdf, uploadaudio, pdfdetails};