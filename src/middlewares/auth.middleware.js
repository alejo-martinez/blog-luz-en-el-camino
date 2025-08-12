import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import utils from '../utils.js';
import CustomError from '../errors/custom.error.js';

export const noUser = (req, res, next) => {
    const token = utils.cookieExtractor(req);
    if (!token) return res.status(401).redirect('/login?redirect=chat');
    else {
        jwt.verify(token, config.privateKey, (error, credentials) => {
            if (error) return res.status(403).send({ status: 'error', error: 'not authorized' })
            else {
                req.user = credentials.user;
                next()
            }
        });
    }
}

export const authToken = (req, res, next) => {
    const token = utils.cookieExtractor(req);
    if (!token) {
        req.user = undefined;
        return next();
    }
    else {
        jwt.verify(token, config.privateKey, (error, credentials) => {
            if (error) return res.status(403).send({ status: 'error', error: 'not authorized' })
            else {
                req.user = credentials.user;
                next()
            }
        });
    }
}

export const adminUser = (req, res, next) => {
    const admin = 'admin';
    try {
        if (req.user && req.user.rol === admin) next();
        else throw new CustomError('Sin permisos', 'No tienes los permisos para realizar esta acción', 3);
    } catch (error) {
        next(error);
    }
};