const formaudio = document.getElementById('formAudio');
const btnaudio = document.getElementById('btnaudio');
const erroraudio = document.getElementById('erroraudio');

btnaudio.addEventListener('click', async(e)=>{
    e.preventDefault();
    const formData = new FormData(formaudio);

    const response = await fetch('http://localhost:8007/api/audio', {
        method:'POST',
        body: formData,
    })
    const json = await response.json();
    console.log(json);
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        
    } else{
        erroraudio.innerHTML = `<span>${json.error}</span>`;
    }
})

const borraraudio = async(id)=>{
    const response = await fetch(`http://localhost:8007/api/audio/${id}`,{
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