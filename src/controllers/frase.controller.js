import { FraseManager } from "../dao/class/fraseManager.js";
import CustomError from "../errors/custom.error.js";
import config from "../config/config.js";
import {s3} from "../utils.js";

const getAll = async(req, res, next)=>{
    try {
        const {page = 1} = req.query;
        const frases = await FraseManager.getAll(page);
        return res.status(200).send({status:'success', payload:frases});
    } catch (error) {
        next(error);
    }
}

const getById = async(req, res, next)=>{
    try {
        const {fid} = req.params;
        const frase = await FraseManager.getById(fid);
        return res.status(200).send({status:'success', payload:frase});
    } catch (error) {
        next(error);
    }
}

const createFrase = async(req, res, next)=>{
    try {
        const {title} = req.body;
        let filePath;
        if(!title) throw new CustomError('No data', 'Debes proporcionar una frase', 6);
        if(!req.file) throw new CustomError('No data', 'Debes subir un pdf', 6);
        const date = new Date();
        filePath = `https://${config.awsbucketfrases}.s3.${config.awsregion}.amazonaws.com/${req.file.originalname}`;
        const params = {
            Bucket: config.awsbucketfrases,
            Key: req.file.originalname,
            Body: req.file.buffer
        }
        s3.upload(params).promise();
        // console.log(obj)
        const obj = {title: title, created_at: date, path: filePath, key: req.file.originalname};
        await FraseManager.create(obj);
        return res.status(200).send({ status: 'success', message: 'Frase subida !' });
    } catch (error) {
        next(error);
    }
}

const deleteFrase = async(req, res, next)=>{
    try {
        const {fid} = req.params;
        await FraseManager.delete(fid);
        return res.status(200).send({status: 'success', message: 'Frase borrada!'});
    } catch (error) {
        next(error);
    }
}

export default {createFrase, deleteFrase, getAll, getById};