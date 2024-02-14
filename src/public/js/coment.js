const socket = io();

const sendComment = (name, text, id, title, type) => {
    const data = { author: name, text: text, id: id, type:type, title: title};
    socket.emit('comment', data);
}

const comentar = async (id, type, title, event) => {
    event.preventDefault();
    const inptTxt = document.getElementById(`txt${id}`);
    const inptName = document.getElementById(`name${id}`);
    const name = inptName.value;
    const text = inptTxt.value;
    const typeCapitalize = type.charAt(0).toUpperCase() + type.slice(1);

    sendComment(name, text, id, title, type);

    Toastify({
        text: `${typeCapitalize} comentado!`,
        duration: 3000,
        }).showToast();
    inptTxt.value = '';
    inptName.value = '';
}

socket.on('newComment', (data)=>{
    const divNoComents = document.getElementById(`nocoment${data.id}`);
    if(divNoComents) window.location.reload();
    document.getElementById(`divComents${data.id}`).innerHTML += `<div class="pdf-section-coments-all">
    <p><strong class="coment-name">${data.author}</strong>: ${data.text}
    </p>
    <p class="coment-date">${data.created_at}</p>
</div>`
});

const borrarcoment = async(cid, fid, type, event)=>{
    event.preventDefault();

    const response = await fetch(`/api/comment/delete/${cid}`, {
        method:'DELETE',
        body: JSON.stringify({fid: fid, type: type}),
        headers:{
            'Content-Type':"application/json",
        }
    })

    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        document.getElementById(`coment${cid}`).remove();
    } else{
        Toastify({
            text: json.error,
            duration: 3000,
            }).showToast();
    }
}

const abrirComent = (id)=>{
    const div = document.getElementById(`divResp${id}`);
    div.innerHTML = `<input type='text' id='inptResp${id}' />
    <button onclick="sendResponse('${id}')">Enviar</button>`;
    div.classList.remove('div-response');
    div.classList.add('div-response-input');
}

const sendResponse = async(cid) =>{
    const input = document.getElementById(`inptResp${cid}`);
    const data = { text: input.value }
    const response = await fetch(`/api/comment/update/${cid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    });
    const json = await response.json();
    if(json.status === 'succes') {
        setTimeout(() => {
            window.location.href = window.location.href;
        }, 2100);
        Toastify({
            text: json.message,
            duration: 2000,
            }).showToast();
    }
}