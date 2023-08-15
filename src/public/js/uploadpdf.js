const formPdf = document.getElementById('formPdf');
const btnPdf = document.getElementById('btnPdf');
const errorPdf = document.getElementById('errorPdf');

btnPdf.addEventListener('click', async(e)=>{
    e.preventDefault();
    const formData = new FormData(formPdf);

    const response = await fetch('http://localhost:8007/api/pdf', {
        method:'POST',
        body: formData,
    })
    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        
    } else{
        errorPdf.innerHTML = `<span>${json.error}</span>`;
    }
})