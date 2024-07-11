import { FraseManager } from "../dao/class/fraseManager.js";
import CustomError from "../errors/custom.error.js";

const getAll = async(req, res, next)=>{
    try {
        const {page = 1} = req.query;
        
    } catch (error) {
        next(error);
    }
}

const createFrase = async(req, res, next)=>{
    try {
        const {frase} = req.body;
        console.log(frase)
        if(!frase) throw new CustomError('No data', 'Debes proporcionar una frase', 6);
        const date = new Date();
        const obj = {frase: frase, created_at: date};
        console.log(obj)
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

export default {createFrase, deleteFrase};