import passport from "passport";
import local from 'passport-local';
import jwt from 'passport-jwt';
import utils from "../utils.js";
import config from "./config.js";
import { UserManager } from "../dao/class/userManager.js";
import CustomError from "../errors/custom.error.js";

const JWTstrategy = jwt.Strategy;
const localStrategy = local.Strategy;

const ExtractJwt = jwt.ExtractJwt;

const initPassport = ()=> {
    passport.use('jwt', new JWTstrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([utils.cookieExtractor]),
        secretOrKey: config.privateKey
    }, async(jwt_payload, done)=>{
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            done(error)
        }
    }))

    passport.use('register', new localStrategy({
        passReqToCallback: true, usernameField: 'email'
    }, async(req, username, passport, done)=>{
        const {name, email, password} = req.body;
        try {
            const user = await UserManager.getByField('email', email);
            if(user){
                const err = new CustomError('Email en uso', 'Ya existe un usuario registrado con el email ingresado')
                done(err);
            } 
            else {
                const usuario = {name: name, email: email, password: utils.createHash(password)};
                await UserManager.create(usuario);
                return done(null, usuario);
            }
        } catch (error) {
            return done('Error al hacer el registro: ' + error)
        }
    }))

    passport.use('login', new localStrategy({
        passReqToCallback: true, usernameField:'email'
    }, async(req, username, password, done)=>{
        try {
            const {password} = req.body;
            const user = await UserManager.getWithPassword('email', username);
            if(!password || !username) done(null, false, {message:'Debes completar todos los campos'});
            if(!user || !utils.isValidPassword(user, password)) done(null, false, {message: 'Email o contraseña incorrecta'});
            else{
                const usuario = await UserManager.getByField('email', username);
                done(null, usuario, {message:'Usuario logueado!'});
            } 
        } catch (error) {
            return done('Error al iniciar sesión: ' + error);
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    })

    passport.deserializeUser(async(id, done)=>{
        let usuario = await UserManager.getById(id);
        done(null, usuario);
    })
}

export default initPassport;