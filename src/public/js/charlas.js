const btnEnviarMsg = document.getElementById('btnmsg');
const texto = document.getElementById('message');

const enviarMsg = async()=>{
    const data = texto.value;
    const response = await fetch('https://blog-luz-en-el-camino-production.up.railway.app/api/user/', {
        method:'POST',
        body:JSON.stringify({text: data}),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            type: 'success',
            text: json.message,
            duration: 3000,
            }).showToast();
    }else{
        Toastify({
            text: json.error,
            duration: 3000,
            }).showToast();
    }
}

btnEnviarMsg.addEventListener('click', async(e)=>{
    e.preventDefault();
    await enviarMsg();
})