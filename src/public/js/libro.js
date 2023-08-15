const pdfjsLib = window['pdfjs-dist/build/pdf'];
const pdfViewer = document.getElementById("pdf-viewer");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const divPath = document.getElementById('divLibro').getAttribute('data-path');
const pdfErrorMessage = document.getElementById("pdf-error-message");
// console.log(divPath);

let currentPage = 1;

pdfjsLib.getDocument(divPath).promise.then(pdfDoc => {
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
}).catch(error =>{
    pdfErrorMessage.style.display = 'block';
})