const btnEnviarMsg = document.getElementById('btnmsg');
const texto = document.getElementById('message');

const enviarMsg = async()=>{
    const data = texto.value;
    const response = await fetch('http://localhost:8007/api/user/', {
        method:'POST',
        body:JSON.stringify({text: data}),
        headers:{
            'Content-Type':'application/json'
        }
    });
    const json = await response.json();
    console.log(json);
}

btnEnviarMsg.addEventListener('click', async(e)=>{
    e.preventDefault();
    await enviarMsg();
})