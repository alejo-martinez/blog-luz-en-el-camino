import config from "../config/config.js";
import { UserManager } from "../dao/class/userManager.js";
import CustomError from "../errors/custom.error.js";
import utils from "../utils.js";

const createUser = async (req, res) => {
    return res.send({ status: 'succes', message: 'Usuario creado!' });
}

const userLogued = async (req, res, next) => {
    try {
        const usuario = req.user;
        const accesToken = utils.generateToken(usuario);
        res.cookie('accesToken', accesToken, { maxAge: 60 * 60 * 2000, signed: true, httpOnly: true }).send({ status: 'succes', payload: usuario.email });
    } catch (error) {
        next(error);
    }
}

const logOut = async (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            res.send({ status: 'error', message: 'no pudimos cerrar la sesion: ' + error });
        }
        else {
            res.clearCookie('accesToken').send({ status: 'succes', message: 'sesion cerrada con exito' })
        }
    })
}

const current = async (req, res, next) => {
    const usuario = req.user;
    res.send({ status: 'succes', payload: usuario });
}

const sendMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserManager.getByField('email', email)
        if (!user) throw new CustomError('No data', 'El email que ingresaste no coincide con ningún usuario registrado', 4);
        await utils.transporte.sendMail({
            from: config.adminEmail,
            to: email,
            subject: 'Cambio de contraseña',
            html: `<div><h3>Solicitó un cambio de contraseña</h3><p>Para cambiar su contraseña porfavor ingrese al siguiente link: http://localhost:8007/api/session/reset/${user._id} Si no fue usted desestime este mensaje.</p></div>`
        })
        return res.status(200).send({ status: 'succes', message: 'Correo enviado !' });
    } catch (error) {
        next(error)
    }
}

const resetPassword = async(req, res, next)=>{
    const {uid} = req.params;
    await UserManager.resetPassword(uid);
    return res.status(200).redirect(`/resetpassword/${uid}`);
}

const updatePassword = async(req, res, next)=>{
    try {
        const {uid} = req.params;
        const {password} = req.body;
        await UserManager.updatePassword(uid, password);
        res.status(200).send({status:'succes', message:'Contraseña actualizada!'});
    } catch (error) {
        next(error);
    }
}

export default { createUser, userLogued, logOut, current, sendMail, resetPassword, updatePassword };