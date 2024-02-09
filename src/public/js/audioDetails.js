// const divComents = document.getElementById('divComents');
// const audioId = document.getElementById('divAudio').getAttribute('data-id')

// const socket = io();

// const sendComment = (name, text, id, audioTitle) => {
//     const data = { author: name, text: text, id: id, type:'audio', title: audioTitle};
//     socket.emit('comment', data);
// }

// const comentar = async (id) => {

//     const inptTxt = document.getElementById(`txt${id}`);
//     const inptName = document.getElementById(`name${id}`);
//     const name = inptName.value;
//     const audioTitle = document.getElementById('divAudio').getAttribute('data-title');

//     sendComment(name, inptTxt.value, id, audioTitle);
//     Toastify({
//         text: 'Audio comentado!',
//         duration: 3000,
//         }).showToast();
//     inptTxt.value = ''
// }

// socket.on('audioComment', (data)=>{
//     divComents.innerHTML += `<div class="pdf-section-coments-all">
//     <p><strong class="coment-name">${data.author}</strong>: ${data.text}
//     </p>
//     <p class="coment-date">${data.created_at}</p>
// </div>`
// })

// const borrarcoment = async(cid)=>{
//     const response = await fetch(`/api/comment/delete/${cid}`, {
//         method:'DELETE',
//         body: JSON.stringify({fid: audioId, type: 'audio'}),
//         headers:{
//             'Content-Type':"application/json",
//         }
//     })

//     const json = await response.json();
//     if(json.status === 'succes'){
//         Toastify({
//             text: json.message,
//             duration: 3000,
//             }).showToast();
//         document.getElementById(`comentAudio${cid}`).remove();
//     } else{
//         Toastify({
//             text: json.error,
//             duration: 3000,
//             }).showToast();
//     }
// }

// const abrirComent = (id)=>{
//     const div = document.getElementById(`divResp${id}`);
//     div.innerHTML = `<input type='text' id='inptResp${id}' />
//     <button onclick="sendResponse('${id}')">Enviar</button>`;
//     div.classList.remove('div-response');
//     div.classList.add('div-response-input');
// }

// const sendResponse = async(cid) =>{
//     const input = document.getElementById(`inptResp${cid}`);
//     const data = { text: input.value }
//     const response = await fetch(`/api/comment/update/${cid}`, {
//         method: 'PUT',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-type': 'application/json'
//         }
//     });
//     const json = await response.json();
//     if(json.status === 'succes') {
//         setTimeout(() => {
//             window.location.href = window.location.href;
//         }, 2100);
//         Toastify({
//             text: json.message,
//             duration: 2000,
//             }).showToast();
//     }
// }