const formfrase = document.getElementById('formFrase');
const btnfrase = document.getElementById('btnfrase');
const errorfrase = document.getElementById('errorfrase');
// const inptFrase = document.getElementById('inptFrase');

btnfrase.addEventListener('click', async(e)=>{
    e.preventDefault();
    const loaderDiv = document.getElementById('loader');
    loaderDiv.classList.remove('loader-container');
    loaderDiv.classList.add('loading');
    const formData = new FormData(formfrase);
    // const formDataArray = Array.from(formData.entries());
    // const obj = {frase: inptFrase.value};
    // console.log(obj);
    // const obj = {frase: };
    // console.log(obj)
    const response = await fetch('/api/frase', {
        method:'POST',
        body: formData,
    })
    const json = await response.json();
    console.log(json);
    if(json.status === 'success'){
        loaderDiv.classList.remove('loading');
        loaderDiv.classList.add('loader-container');
        // inptFrase.value = '';
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
        
    } else{
        loaderDiv.classList.remove('loading');
        loaderDiv.classList.add('loader-container');
        errorfrase.innerHTML = `<span>${json.error}</span>`;
    }
})

const borrarfrase = async(id)=>{
    const response = await fetch(`/api/frase/${id}`,{
        method:'DELETE'
    })

    const json = await response.json();
    if(json.status === 'success'){
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