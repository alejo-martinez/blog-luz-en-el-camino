const pdfjsLib = window['pdfjs-dist/build/pdf'];
const pdfPath = document.getElementById('divPdf').getAttribute('data-path');
const pdfId = document.getElementById('divPdf').getAttribute('data-id')
const pdfViewer = document.getElementById("pdf-viewer");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pdfErrorMessage = document.getElementById("pdf-error-message");
const divComents = document.getElementById('divComents');

const socket = io();

let currentPage = 1;

const sendComment = (name, text, id) => {
    const data = { name: name ? name : 'Anónimo', text: text, id: id};
    socket.emit('comment', data);
}

pdfjsLib.getDocument(pdfPath).promise.then(pdfDoc => {
    const numPages = pdfDoc.numPages;

    function renderPage(pageNumber) {
        pdfDoc.getPage(pageNumber).then(page => {
            const scale = 0.8;
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

const comentar = async (id) => {

    const inptTxt = document.getElementById(`txt${id}`);
    const inptName = document.getElementById(`name${id}`);
    const name = inptName.value;
    sendComment(name, inptTxt.value, id);
    inptTxt.value = ''
}

socket.on('comment', (data)=>{
    divComents.innerHTML += `<div class="pdf-section-coments-all">
    <p><strong class="coment-name">${data.name}</strong>: ${data.text}
    </p>
    <p class="coment-date">${data.created_at}</p>
</div>`
})

const borrarcoment = async(index)=>{
    const response = await fetch('http://localhost:8007/api/pdf/coment', {
        method:'DELETE',
        body: JSON.stringify({id: pdfId, index: index}),
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