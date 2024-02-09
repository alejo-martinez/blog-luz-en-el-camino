const divEachMsg = document.getElementById('divEachMsg');

const socket = io();

const navegar = ()=>{
    setTimeout(()=>{
        window.location.replace('/login')
    }, 2000)
}

socket.on('newResponseMsg', (data)=>{
    const divMsg = document.getElementById(`chat${data.id}`);
    divMsg.innerHTML += `<div class="div-chats-user">
    <div>
    <strong>${data.sender}</strong>
    <p>: ${data.text}</p>
    </div>
    <p class="coment-date">${data.created_at}</p>
</div>`
})

socket.on('newMessage', (data) => {
    const divEachMsg = document.getElementById('divEachMsg');
    divEachMsg.innerHTML += `<div class="div-chats-user">
    <div>
    <strong>${data.name}</strong>
    <p>: ${data.text}</p>
    </div>
    <p class="coment-date">${data.created_at}</p>
</div>`
})

const enviarMsg = async (event, id) => {
    event.preventDefault();
    try {
        const texto = document.getElementById('message');
        const userId = document.getElementById('divFormChat').getAttribute('data-user');
        const userName = document.getElementById('divFormChat').getAttribute('data-name');
        const dataText = texto.value;
        const obj = { sender: userId, text: dataText, name: userName }
        socket.emit('message', obj);
        texto.value = ''
    } catch (error) {
        console.log(error)
    }

}


const respuestaAdmin = async (event, uid, id) => {
    event.preventDefault();
    const inputResponse = document.getElementById(`message${id}`);
    const response = inputResponse.value;
    const obj = { sender: uid, text: response, name: 'Luz en el Camino', to:id };
    socket.emit('responsemsg', obj);
    inputResponse.value = '';
}


const showConversation = (event, id, admin) => {
    event.preventDefault();
    const btnCross = document.getElementById(`cross${id}`);
    const divMsgs = document.getElementById(`chat${id}`);
    const btnShow = document.getElementById(`btnShow${id}`);

    btnCross.classList.remove('hidden');
    divMsgs.classList.remove('hidden');
    btnShow.classList.add('hidden');
    if(admin) document.getElementById(`divFormChat${id}`).classList.remove('hidden');
}

const closeConversation = (event, id, admin) => {
    event.preventDefault();
    const btnCross = document.getElementById(`cross${id}`);
    const divMsgs = document.getElementById(`chat${id}`);
    const btnShow = document.getElementById(`btnShow${id}`);

    btnCross.classList.add('hidden');
    divMsgs.classList.add('hidden');
    btnShow.classList.remove('hidden');
    if(admin) document.getElementById(`divFormChat${id}`).classList.add('hidden');
}

const handleChangeContent = (event)=>{
    event.preventDefault();
    const btnChat = document.getElementById('btnChat');
    const btnContent = document.getElementById('btnUsersChats');
    const div = document.getElementById('divMsgUser');
    const divAllChats = document.getElementById('divAllChats');
    if(btnChat.classList.contains('btn-pressed')){
        btnChat.classList.remove('btn-pressed');
        btnContent.classList.add('btn-pressed');
        div.classList.add('hidden');
        divAllChats.classList.remove('hidden');
    }
    else{
        btnChat.classList.add('btn-pressed');
        btnContent.classList.remove('btn-pressed');
        div.classList.remove('hidden');
        divAllChats.classList.add('hidden');
    }
}

const deleteMsg = async(event, id, uid)=>{
    event.preventDefault();
    const response = await fetch(`/api/message/delete/${id}/${uid}`, {
        method: 'DELETE',
    });
    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        document.getElementById(`msg${id}`).remove();
    }
}