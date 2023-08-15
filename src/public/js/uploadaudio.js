const formaudio = document.getElementById('formAudio');
const btnaudio = document.getElementById('btnaudio');
const erroraudio = document.getElementById('erroraudio');

btnaudio.addEventListener('click', async(e)=>{
    e.preventDefault();
    const formData = new FormData(formaudio);

    const response = await fetch('https://blog-luz-en-el-camino-production.up.railway.app/api/audio', {
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
        erroraudio.innerHTML = `<span>${json.error}</span>`;
    }
})