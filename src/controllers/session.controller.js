import utils from "../utils.js";

const createUser = async(req, res)=>{
    return res.send({status:'succes', message:'Usuario creado!'});
}

const userLogued = async(req, res, next)=>{
    try {
        const usuario = req.user;
        const accesToken = utils.generateToken(usuario);
        res.cookie('accesToken', accesToken, {maxAge: 60*60*2000, signed: true, httpOnly: true}).send({status:'succes', payload: usuario.email});
    } catch (error) {
        next(error);
    }
}

const logOut = async(req, res, next)=>{
    req.session.destroy(error =>{
        if(error) {
            res.send({status:'error', message: 'no pudimos cerrar la sesion: ' + error});
        }
        else{
         res.clearCookie('accesToken').send({status: 'succes', message: 'sesion cerrada con exito'})
        }})
}

const current = async(req, res, next)=>{
    const usuario = req.user;
    res.send({status:'succes', payload: usuario});
}

export default {createUser, userLogued, logOut, current};