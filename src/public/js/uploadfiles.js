const btnVideo = document.getElementById('btnvideo');

btnVideo.addEventListener('click', async(e)=>{
    e.preventDefault();
    const loaderDiv = document.getElementById('loader');
    loaderDiv.classList.remove('loader-container');
    loaderDiv.classList.add('loading');
    const formVideo = document.getElementById('formVideo');
    const formData = new FormData(formVideo);

    const response = await fetch('/api/video/create', {
        method:'POST',
        body: formData,
    })
    const json = await response.json();
    if(json.status === 'succes'){
        loaderDiv.classList.remove('loading');
        loaderDiv.classList.add('loader-container');
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        
    } else{
        console.log(json.error)
        // const errorVideo = document.getElementById('errorVideo');
        // errorVideo.innerHTML = `<span>${json.error}</span>`;
    }
})

const borrarvideo = async(id, event)=>{
    event.preventDefault();
    const response = await fetch(`api/video/delete/${id}`,{
        method:'DELETE'
    });
    const json = await response.json();
    if(json.status === 'success'){
        Toastify({
            text:json.message,
            duration: 3000,
        }).showToast();
    } else{
        console.log(json.error)
        // const errorVideo = document.getElementById('errorVideo');
        // errorVideo.innerHTML = `<span>${json.error}</span>`;
    }
}