import {io} from '../app.js';
import { ComentManager } from '../dao/class/comentManager.js';
import { CommentDTO } from '../dto/comment.DTO.js';

io.on('connection', async(socket)=>{
    console.log("Conectado al servidor");

    socket.on('comment', async(data)=>{
        const date = new Date();
        const comentario = new CommentDTO(data.text, data.author, date);
        const response = await ComentManager.create(comentario, data.type, data.id);
        await utils.transporte.sendMail({to:config.adminEmail, sender:config.adminEmail, subject:`Un ${data.type === 'pdf'? 'PDF' : 'audio'} ha sido comentado`, text:`El ${data.type === 'pdf'? 'PDF' : 'audio'} "${response.title}" recibió un comentario.`})
        io.emit('comment', comentario)
    })

    // socket.on('audiocomment', async(data)=>{
    //     const date = new Date();
    //     // const newData = {name: data.name, text: data.text, created_at: utils.formatDate(date)};
    //     await AudioManager.coment(data.name, data.text, data.id);
    //     const audio = await AudioManager.getById(data.id);
    //     // await utils.transporte.sendMail({to: config.adminEmail, sender: config.adminEmail, subject: 'Un audio ha sido comentado', text: `El audio "${audio.title}" recibió un comentario`});
    //     io.emit('audiocomment', newData);
    // })
});