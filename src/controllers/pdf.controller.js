import utils,{s3} from "../utils.js";
import path from 'path';
import fs from 'fs';
import { PdfManager } from "../dao/class/pdfManager.js";
import CustomError from "../errors/custom.error.js";
import config from "../config/config.js";


const getAll = async (req, res, next) => {
    try {
        const pdfs = await PdfManager.getAll();
        return res.status(200).send({ status: 'succes', payload: pdfs });
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const pdf = await PdfManager.getById(pid);
        return res.status(200).send({ status: 'succes', payload: pdf });
    } catch (error) {
        next(error)
    }
}

const createPdf = async (req, res, next) => {
    try {
        const { title, category } = req.body;
        let filePath;
        if (!title || !category) throw new CustomError('Faltan argumentos', `El titulo es necesario: ${title}. La categoría es necesaria: ${category}`, 2);
        if (!req.file) throw new CustomError('Faltan argumentos', 'Debes subir un pdf', 2);
        else {
            const titulo = await PdfManager.getOne('title', title);
            if (titulo) throw new CustomError('Argumento en uso', 'Ya existe un pdf con el mismo título', 6)
            else {
                filePath = `https://${config.awsbucketpdfs}.s3.${config.awsregion}.amazonaws.com/${req.file.originalname}`;
                const params = {
                    Bucket: config.awsbucketpdfs,
                    Key: req.file.originalname,
                    Body: req.file.buffer
                }
                s3.upload(params).promise();
                await PdfManager.create({ title: title, path: filePath, category: category, key: req.file.originalname })
                return res.status(200).send({ status: 'succes', message: 'Pdf subido !' });
            }
        }
    } catch (error) {
        next(error)
    }
}

const comentarPdf = async(req, res, next)=> {
    try {
        const {pid} = req.params;
        const {name, text} = req.body;
        await PdfManager.coment(name, text, pid);
        res.status(200).send({status:'succes', message: 'Pdf comentado !'})
    } catch (error) {
        next(error);
    }
}

const deleteComentPdf = async(req, res, next)=>{
    try {
        const {id, index} = req.body;
        await PdfManager.deleteComent(id, index);
        res.status(200).send({status:'succes', message: 'Comentario borrado!'})
    } catch (error) {
        next(error)
    }
}

const updatePdf = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const { title, category } = req.body;
        let filePath;
        let updatedFields = [];
        const pdf = await PdfManager.getById(pid);
        if (title) {
            await PdfManager.update(pid, 'title', title);
            updatedFields.push(`Título actualizado en: ${title}`) ;
        }
        if (category) {
            await PdfManager.update(pid, 'category', category);;
            updatedFields.push(`Categoría actualizada en: ${category}`)  
        }
        if (req.file) {
            filePath = `public/pdfs/${req.file.filename}`;
            const ruta = path.join(utils.__dirname, pdf.path);
            fs.unlinkSync(ruta);
            await PdfManager.update(pid, 'path', filePath);
            updatedFields.push('Archivo actualizado')   
        }
        if(!title && !category && !req.file) throw new CustomError('Faltan argumentos', 'Debes actualizar algun campo', 2);
        let fieldsReponse = updatedFields.join(', ');
        return res.status(200).send({status:'succes', message: updatedFields.length > 1? `Campos actualizados: ${fieldsReponse}`: fieldsReponse});
    } catch (error) {
        next(error)
    }
}

const deletePdf = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const pdf = await PdfManager.getById(pid);
        const params = {Bucket: config.awsbucketpdfs, Key: pdf.key}
        await PdfManager.delete(pid);
        s3.deleteObject(params, (err, data)=>{
            if(err){
                throw new CustomError('Error en la bdd', `Error al borrar el archivo: ${err}`, 5)
            } else {
                res.status(200).send({ status: 'succes', message: 'Audio eliminado !' });
            }
        })
        res.status(200).send({ status: 'succes', message: 'Pdf eliminado con éxito !' });
    } catch (error) {
        next(error)
    }
}

export default { getAll, getById, createPdf, updatePdf, deletePdf, comentarPdf, deleteComentPdf }