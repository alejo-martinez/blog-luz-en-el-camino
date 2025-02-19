import { VideoManager } from "../dao/class/videoManager.js";
import CustomError from "../errors/custom.error.js";
import config from "../config/config.js";
import { s3 } from '../utils.js';
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { client } from '../utils.js';
import path from "path";
import ffmpeg from "../config/ffmpeg.config.js";
import utils from "../utils.js";
import fs from 'fs'
import { io } from "../app.js";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const getVideos = async (req, res, next) => {
    try {
        const { page = 1, sort } = req.query;
        const videos = await VideoManager.getAll(page, sort);
        res.status(200).send({ status: 'success', payload: videos });
    } catch (error) {
        next(error);
    }
}

const getVideoById = async (req, res, next) => {
    try {
        const { vid } = req.params;
        const video = await VideoManager.getById(vid);
        res.status(200).send({ status: 'success', payload: video });
    } catch (error) {
        next(error);
    }
}

const createVideo = async (req, res, next) => {
    try {
        const { title } = req.body;
        let filePath;
        if (!title) throw new CustomError('Faltan argumentos', `El titulo es necesario: ${title}.`, 2);
        if (!req.file) throw new CustomError('Faltan argumentos', 'Debes subir un video', 2);
        else {
            const titulo = await VideoManager.getOne('title', title);
            if (titulo) throw new CustomError('Argumento en uso', 'Ya existe un video con el mismo título', 6)
            else {
                const { name } = path.parse(req.file.originalname);
                const outputFilePath = path.join(utils.__dirname, 'uploads', `${name}.webm`);
                const tempInputPath = path.join(utils.__dirname, 'uploads', req.file.originalname);

                fs.writeFileSync(tempInputPath, req.file.buffer);

                res.status(200).send({ status: 'succes', message: 'Video válido, subiendo archivo !' });
                setImmediate(async () => {
                    try {
                        let totalDuration = 0;

                        ffmpeg.ffprobe(tempInputPath, (err, metadata) => {
                            if (err) {
                                console.error('Error al obtener metadatos:', err);
                                return;
                            }
                            totalDuration = metadata.format.duration;
                        });

                        await new Promise((resolve, reject) => {
                            ffmpeg(tempInputPath)
                                .output(outputFilePath)
                                .on('progress', (progress) => {
                                    if (totalDuration) {
                                        const percentage = ((progress.timemark.split(':').reduce((acc, time) => (60 * acc) + +time, 0) / totalDuration) * 100).toFixed(0);

                                        io.emit('video_conversion_progress', { progress: percentage, timestamp: new Date().toLocaleString() });
                                    }
                                })
                                .on('end', () => {

                                    io.emit('video_conversion_status', { status: 'completed', message: 'La conversión ha finalizado.', timestamp: new Date().toLocaleString() });
                                    resolve();
                                })
                                .on('error', (err) => {

                                    io.emit('video_conversion_status', { status: 'error', message: `Error en la conversión: ${err.message}.`, timestamp: new Date().toLocaleString() });
                                    reject(err);
                                })
                                .run();
                        });

                        // Leer el archivo convertido
                        const fileBuffer = fs.readFileSync(outputFilePath);
                        filePath = `https://${config.awsbucketvideos}.s3.${config.awsregion}.amazonaws.com/${name}.webm`;
                        const params = {
                            Bucket: config.awsbucketvideos,
                            Key: `${name}.webm`,
                            Body: fileBuffer
                        }
                        const uploadCommand = new PutObjectCommand(params);
                        const result = await client.send(uploadCommand);
                        

                        await VideoManager.create({ title: title, path: filePath, key: `${name}.webm` })

                        if(result.$metadata.httpStatusCode === 200){
                            utils.cleanUpFiles([tempInputPath, outputFilePath]);
                            io.emit('video_uploaded', { message: 'Video subido con éxito', timestamp: new Date().toLocaleString() });
                        }
                    } catch (error) {
                        console.log('error al convertir el archivo ' + error);
                    }
                })
            }
        }
    } catch (error) {
        next(error);
    }
}

const updateVideo = async (req, res, next) => {
    try {
        const { vid } = req.params;
        const { field, value } = req.body;
        await VideoManager.update(vid, field, value);
        return res.status(200).send({ status: 'success', message: `Se ha actualizado el campo "${field}"` });
    } catch (error) {
        next(error);
    }
}

const deleteVideo = async (req, res, next) => {
    try {
        const { vid } = req.params;
        // const video = await VideoManager.getById(vid);
        // // const params = { Bucket: config.awsbucketvideos, Key: video.key }
        // // const command = new DeleteObjectCommand(params);
        // // // console.log(JSON.stringify(command));
        // // const resp = await client.send(command);
        // // console.log('llego aca')
        // // console.log(resp);
        await VideoManager.delete(vid);

        return res.status(200).json({ status: "success", message: "Vídeo eliminado !" })
    } catch (error) {
        next(error);
    }
}

export default { createVideo, updateVideo, deleteVideo, getVideos, getVideoById };