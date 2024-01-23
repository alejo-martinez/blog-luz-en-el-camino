const divComents = document.getElementById('divComents');
const audioId = document.getElementById('divAudio').getAttribute('data-id')

const socket = io();

const sendComment = (name, text, id) => {
    const data = { author: name, text: text, id: id, type:'audio'};
    socket.emit('comment', data);
}

const comentar = async (id) => {

    const inptTxt = document.getElementById(`txt${id}`);
    const inptName = document.getElementById(`name${id}`);
    const name = inptName.value;
    sendComment(name, inptTxt.value, id);
    Toastify({
        text: 'Audio comentado!',
        duration: 3000,
        }).showToast();
    inptTxt.value = ''
}

socket.on('comment', (data)=>{
    divComents.innerHTML += `<div class="pdf-section-coments-all">
    <p><strong class="coment-name">${data.author}</strong>: ${data.text}
    </p>
    <p class="coment-date">${data.created_at}</p>
</div>`
})

const borrarcoment = async(cid)=>{
    const response = await fetch(`/api/coment/delete/${cid}`, {
        method:'DELETE',
        body: JSON.stringify({id: audioId, type: 'audio'}),
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
    <button onclick="sendResponse('${id}', '${audioId}')">Enviar</button>`;
    div.classList.remove('div-response');
    div.classList.add('div-response-input');
}

const sendResponse = async(cid, pid) =>{
    const input = document.getElementById(`inptResp${cid}`);
    const response = await fetch(`/api/audio/coment/${pid}/${cid}`, {
        method:'POST',
        body:JSON.stringify({coment: input.value}),
        headers:{
            'Content-type':'application/json'
        }
    });
    const json = await response.json();
    console.log(json);
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