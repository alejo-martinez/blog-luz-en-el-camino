import { VideoManager } from "../dao/class/videoManager.js";
import CustomError from "../errors/custom.error.js";
import config from "../config/config.js";
import {s3} from '../utils.js';
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import {client} from '../utils.js';

const createVideo = async(req, res, next)=>{
    try {
        const { title } = req.body;
        let filePath;
        if (!title) throw new CustomError('Faltan argumentos', `El titulo es necesario: ${title}.`, 2);
        if (!req.file) throw new CustomError('Faltan argumentos', 'Debes subir un video', 2);
        else {
            const titulo = await VideoManager.getOne('title', title);
            if (titulo) throw new CustomError('Argumento en uso', 'Ya existe un video con el mismo título', 6)
            else {
                filePath = `https://${config.awsbucketvideos}.s3.${config.awsregion}.amazonaws.com/${req.file.originalname}`;
                const params = {
                    Bucket: config.awsbucketvideos,
                    Key: req.file.originalname,
                    Body: req.file.buffer
                }
                const uploadCommand = new PutObjectCommand(params);
                const result = await client.send(uploadCommand);
                console.log(result);
                // s3.upload(params).promise();
                await VideoManager.create({ title: title, path: filePath, key: req.file.originalname })
                return res.status(200).send({ status: 'succes', message: 'Video subido !' });
            }
        }
    } catch (error) {
        next(error);
    }
}

const updateVideo = async(req, res, next)=>{
    try {
        const {vid} = req.params;
        const {field, value} = req.body;
        await  VideoManager.update(vid, field, value);
        return res.status(200).send({status:'success', message:`Se ha actualizado el campo "${field}"`});
    } catch (error) {
        next(error);
    }
}

const deleteVideo = async(req, res, next)=>{
    try {
        const {vid} = req.params;
        // const video = await VideoManager.getById(vid);
        // // const params = { Bucket: config.awsbucketvideos, Key: video.key }
        // // const command = new DeleteObjectCommand(params);
        // // // console.log(JSON.stringify(command));
        // // const resp = await client.send(command);
        // // console.log('llego aca')
        // // console.log(resp);
        await VideoManager.delete(vid);

        return res.status(200).json({status:"success",message:"Vídeo eliminado !"})
    } catch (error) {
        next(error);
    }
}

export default {createVideo, updateVideo, deleteVideo};