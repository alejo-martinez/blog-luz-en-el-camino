const formaudio = document.getElementById('formAudio');
const btnaudio = document.getElementById('btnaudio');
const erroraudio = document.getElementById('erroraudio');

btnaudio.addEventListener('click', async(e)=>{
    e.preventDefault();
    const loaderDiv = document.getElementById('loader');
    loaderDiv.classList.remove('loader-container');
    loaderDiv.classList.add('loading');
    const formData = new FormData(formaudio);

    const response = await fetch('/api/audio', {
        method:'POST',
        body: formData,
    })
    const json = await response.json();
    console.log(json);
    if(json.status === 'succes'){
        loaderDiv.classList.remove('loading');
        loaderDiv.classList.add('loader-container');
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        
    } else{
        erroraudio.innerHTML = `<span>${json.error}</span>`;
    }
})

const borraraudio = async(id)=>{
    const response = await fetch(`/api/audio/${id}`,{
        method:'DELETE'
    })

    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            callback: location.reload()
            }).showToast();
    } else{
        Toastify({
            text: json.error,
            duration: 3000,
            }).showToast();
    }
} 