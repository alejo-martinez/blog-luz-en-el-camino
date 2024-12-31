import { AudioManager } from "../dao/class/audioManager.js";
import CustomError from "../errors/custom.error.js";
import utils, { s3 } from "../utils.js";
import path from 'path';
import { Readable } from 'stream';
import fs from 'fs';
import config from "../config/config.js";
import * as musicMetadata from 'music-metadata';

const getAll = async (req, res, next) => {
    try {
        const {page=1, sort} = req.query;
        const audios = await AudioManager.getAll(page, sort);
        return res.status(200).send({ status: 'succes', payload: audios })
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const id = req.params.pid;
        const audio = await AudioManager.getById(id);
        return res.status(200).send({ status: 'succes', payload: audio });
    } catch (error) {
        next(error);
    }
};

const createAudio = async (req, res, next) => {
    try {
        const title = req.body.title;
        let filePaTh;
        if (!title) throw new CustomError('Faltan argumentos', 'Debes ingresar un título', 2);
        if (!req.file) throw new CustomError('Faltan argumentos', 'Debes subir un archivo', 2);
        else {
            const tituloExist = await AudioManager.getOne('title', title);
            if (tituloExist) throw new CustomError('Argumento existente', `Ya existe un audio con el titulo: ${title}`, 6);
            else {
                const metadata = await musicMetadata.parseBuffer(req.file.buffer);
                const duration = metadata.format.duration;
                filePaTh = `${config.distributionDomain}/${req.file.originalname}`;
                const params = {
                    Bucket: config.awsbucketaudios,
                    Key: req.file.originalname,
                    Body: req.file.buffer
                }
                s3.upload(params).promise();
                await AudioManager.create({ title: title, path: filePaTh, key: req.file.originalname, duration: duration });
                return res.status(200).send({ status: 'succes', message: 'Audio subido !' });
            }
        }
    } catch (error) {
        next(error);
    }
};

const updateAudio = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const { title } = req.body;
        let filePath;
        let updatedFields = [];
        const audio = await AudioManager.getById(pid);
        if (title) {
            await AudioManager.update(pid, 'title', title);
            updatedFields.push(`Título actualizado en: ${title}`);
        }
        if (req.file) {
            filePath = `public/audios/${req.file.filename}`;
            const ruta = path.join(utils.__dirname, audio.path);
            fs.unlinkSync(ruta);
            await AudioManager.update(pid, 'path', filePath);
            updatedFields.push("Archivo actualizado")
        }
        if (!title && !req.file) throw new CustomError('Faltan argumentos', 'Debes actualizar algun campo', 2);
        let fieldsResponse = updatedFields.join(', ')
        res.status(200).send({ status: 'succes', message: updatedFields.length > 1 ? `Campos actualizados: ${fieldsResponse}` : fieldsResponse });
    } catch (error) {
        next(error);
    }
};

const deleteAudio = async (req, res, next) => {
    try {
        const { pid } = req.params;
        // const audio = await AudioManager.getById(pid);
        // const params = {Bucket: config.awsbucketaudios, Key: audio.key}
        await AudioManager.delete(pid);
        // s3.deleteObject(params, (err, data)=>{
        //     if(err){
        //         throw new CustomError('Error en la bdd', `Error al borrar el archivo: ${err}`, 5)
        //     } else {
        //         res.status(200).send({ status: 'succes', message: 'Audio eliminado !' });
        //     }
        // })
    } catch (error) {
        next(error);
    }
};

const fastUpdate = async (req, res, next) => {
    try {
      const audios = await AudioManager.get();
  
      for (const audio of audios) {
        const params = {
          Bucket: config.awsbucketaudios,
          Key: audio.key,
        };
  
        const audioFile = await s3.getObject(params).promise();
        let audioBuffer;
  
        // Verifica si Body es un stream
        if (audioFile.Body instanceof Readable) {
          const chunks = [];
          for await (const chunk of audioFile.Body) {
            chunks.push(chunk);
          }
          audioBuffer = Buffer.concat(chunks);
        } else if (Buffer.isBuffer(audioFile.Body)) {
          // Si es un Buffer, úsalo directamente
          audioBuffer = audioFile.Body;
        } else {
          throw new Error('Body no es un stream legible ni un Buffer');
        }
  
        // Extrae metadata y calcula duración
        const metadata = await musicMetadata.parseBuffer(audioBuffer);
        const duration = metadata.format.duration; // Duración en segundos
  
        // Actualiza la duración en la base de datos
        await AudioManager.update(audio._id, 'duration', duration);
  
        console.log(`Audio ${audio._id} actualizado con duración: ${duration}s`);
      }
  
      res.status(200).send({ status: 'OK !' });
    } catch (error) {
      console.error(`Error al procesar:`, error);
      res.status(500).send({ error: error.message });
    }
  };


export default { getAll, getById, createAudio, updateAudio, deleteAudio, fastUpdate };