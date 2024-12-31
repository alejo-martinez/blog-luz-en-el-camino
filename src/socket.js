import { Server } from "socket.io";

const urlFront = process.env.URL_FRONT;

let io;

const configureSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: urlFront,
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });
};

const sendResponse = (channel, data) => {
    io.to(channel).emit('response', data);
}

export {
    configureSocket,
    sendResponse
}