

const socket = io()

socket.on('newMessage', (data)=>{
    console.log(data);
    divEachMsg.innerHTML +=`<div class="div-chats-user">
    <p><strong>${data.name}</strong>: ${data.text}
    </p>
    <p class="coment-date">${data.created_at}</p>
</div>`
})

const enviarMsg = async(event, id)=>{
    try {

        const dataText = texto.value;
        const obj = {sender: userId, text: dataText, name: userName}
        socket.emit('message', obj);        
    } catch (error) {
        console.log(error)
    }
}


const showConversation = (event, id)=>{
    event.preventDefault();
    const btnCross = document.getElementById(`cross${id}`);
    const divMsgs = document.getElementById(`chat${id}`);
    const btnShow = document.getElementById(`btnShow${id}`);

    btnCross.classList.remove('hidden');
    divMsgs.classList.remove('hidden');
    btnShow.classList.add('hidden');
}

const closeConversation = (event, id)=>{
    event.preventDefault();
    const btnCross = document.getElementById(`cross${id}`);
    const divMsgs = document.getElementById(`chat${id}`);
    const btnShow = document.getElementById(`btnShow${id}`);

    btnCross.classList.add('hidden');
    divMsgs.classList.add('hidden');
    btnShow.classList.remove('hidden');
}