import { AudioManager } from "../dao/class/audioManager.js";
import CustomError from "../errors/custom.error.js";
import utils from "../utils.js";
import path from 'path';
import fs from 'fs';

const getAll = async(req, res, next) =>{
    try {
        const audios = await AudioManager.getAll();
        return res.status(200).send({status:'succes', payload: audios})
    } catch (error) {
        next(error);       
    }
};

const getById = async(req, res, next) =>{
    try {
        const id = req.params.pid;
        const audio = await AudioManager.getById(id);
        return res.status(200).send({status:'succes', payload: audio});
    } catch (error) {
        next(error);       
    }
};

const createAudio = async(req, res, next) =>{
    try {
        const title = req.body.title;
        let filePaTh;
        if(!title) throw new CustomError('Faltan argumentos', 'Debes ingresar un título', 2);
        if(!req.file) throw new CustomError('Faltan argumentos', 'Debes subir un archivo', 2);
        else {
            const tituloExist = await AudioManager.getOne('title', title);
            if(tituloExist) throw new CustomError('Argumento existente', `Ya existe un audio con el titulo: ${title}`, 6);
            else {
                filePaTh = `public/audios/${req.file.filename}`;
                await AudioManager.create({title: title, path: filePaTh});
                return res.status(200).send({status:'succes', message: 'Audio subido !'});
            }
        }
    } catch (error) {
        next(error);       
    }
};

const updateAudio = async(req, res, next) =>{
    try {
        const {pid} = req.params;
        const {title} = req.body;
        let filePath;
        let updatedFields = [];
        const audio = await AudioManager.getById(pid);
        if(title){
            await AudioManager.update(pid, 'title', title);
            updatedFields.push(`Título actualizado en: ${title}`);
        } 
        if(req.file){
            filePath = `public/audios/${req.file.filename}`;
            const ruta = path.join(utils.__dirname, audio.path);
            fs.unlinkSync(ruta);
            await AudioManager.update(pid, 'path', filePath);
            updatedFields.push("Archivo actualizado") 
        }
        if(!title && !req.file) throw new CustomError('Faltan argumentos', 'Debes actualizar algun campo', 2);
        let fieldsResponse = updatedFields.join(', ')
        res.status(200).send({status:'succes', message: updatedFields.length > 1? `Campos actualizados: ${fieldsResponse}` : fieldsResponse});     
    } catch (error) {
        next(error);       
    }
};

const deleteAudio = async(req, res, next) =>{
    try {
        const {pid} = req.params;
        const audio = await AudioManager.getById(pid);
        const ruta = path.join(utils.__dirname, audio.path);
        fs.unlinkSync(ruta);
        await AudioManager.delete(pid);
        res.status(200).send({status:'succes', message: 'Audio eliminado !'});
    } catch (error) {
        next(error);       
    }
};

export default {getAll, getById, createAudio, updateAudio, deleteAudio};