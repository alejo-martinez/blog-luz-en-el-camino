const pdfjsLib = window['pdfjs-dist/build/pdf'];
const pdfPath = document.getElementById('divPdf').getAttribute('data-path');
const pdfId = document.getElementById('divPdf').getAttribute('data-id')
const pdfViewer = document.getElementById("pdf-viewer");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pdfErrorMessage = document.getElementById("pdf-error-message");
const divComents = document.getElementById('divComents');

// const socket = io();

let currentPage = 1;

// const sendComment = (name, text, id, pdfName) => {
//     const data = { author: name, text: text, id: id, type: 'pdf', title: pdfName };
//     socket.emit('comment', data);
// }

pdfjsLib.getDocument(pdfPath).promise.then(pdfDoc => {
    const numPages = pdfDoc.numPages;

    function renderPage(pageNumber) {
        pdfDoc.getPage(pageNumber).then(page => {
            const scale = 1.1;
            const viewport = page.getViewport({ scale });
            pdfViewer.height = viewport.height;
            pdfViewer.width = viewport.width;

            const context = pdfViewer.getContext("2d");
            pdfViewer.height = viewport.height;
            pdfViewer.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
        });
    }

    renderPage(currentPage);

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < numPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });
}).catch(error => {
    pdfErrorMessage.style.display = 'block';
})

// const comentar = async (id) => {
//     const inptTxt = document.getElementById(`txt${id}`);
//     const inptName = document.getElementById(`name${id}`);
//     const pdfName = document.getElementById('divPdf').getAttribute('data-pdfName');
//     const name = inptName.value;
//     if (inptTxt.value === '') {
//         Toastify({
//             text: "No puedes enviar un comentario vacío, ingresa un texto porfavor.",
//             duration:3000,
//             gravity:"top",
//             position: "center",
//             stopOnFocus: true,
//             style:{
//                 background: "#A61A43",
//                 color: "#ffffff",
//                 width: "300px",
//                 borderRadius: "8px"
//             }
//         }).showToast();
//     } else {

//         sendComment(name, inptTxt.value, id, pdfName);
//         Toastify({
//             text: 'Pdf comentado!',
//             duration: 3000,
//             style:{
//                 background:"rgb(89, 66, 112)",
//                 color:"#ffffff",
//                 borderRadius: "6px"
//             }
//         }).showToast();
//         inptTxt.value = '';
//         inptName.value = '';
//     }
// }

// socket.on('pdfComment', (data) => {
//     divComents.innerHTML += `<div class="pdf-section-coments-all">
//     <p><strong class="coment-name">${data.author}</strong>: ${data.text}
//     </p>
//     <p class="coment-date">${data.created_at}</p>
// </div>`
// })

// const borrarcoment = async (cid) => {
//     const response = await fetch(`/api/comment/delete/${cid}`, {
//         method: 'DELETE',
//         body: JSON.stringify({ fid: pdfId, type: 'pdf' }),
//         headers: {
//             'Content-Type': "application/json",
//         }
//     })

//     const json = await response.json();
//     if (json.status === 'succes') {
//         Toastify({
//             text: json.message,
//             duration: 3000,
//         }).showToast();
//         document.getElementById(`pdf${cid}`).remove();
//     } else {
//         Toastify({
//             text: json.error,
//             duration: 3000,
//         }).showToast();
//     }
// }

// const abrirComent = (id) => {
//     const div = document.getElementById(`divResp${id}`);
//     div.innerHTML = `<input type='text' id='inptResp${id}' />
//     <button onclick="sendResponse('${id}')">Enviar</button>`;
//     div.classList.remove('div-response');
//     div.classList.add('div-response-input');
// }

// const sendResponse = async (cid) => {
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

//     if (json.status === 'succes') {
//         setTimeout(() => {
//             window.location.href = window.location.href;
//         }, 2100);
//         Toastify({
//             text: json.message,
//             duration: 2000,
//         }).showToast();
//     }
// }