const errorField = document.getElementById('errorfieldemail');
const btnSend = document.getElementById('btnSend');
const input = document.getElementById('inputsend');

btnSend.addEventListener('click', async(e)=>{
    e.preventDefault();
    const email = input.value;
    const response = await fetch('https://luzenelcamino.com.ar/api/session/reset', {
        method:'POST',
        body: JSON.stringify({email: email}),
        headers:{
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json();
    console.log(json);
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
    } else {
        errorField.innerHTML = `<span>${json.error}</span>`
    }
})