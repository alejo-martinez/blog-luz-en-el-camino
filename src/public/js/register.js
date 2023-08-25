const errorFieldRegister = document.getElementById('errorfieldregister');
const btnSigin = document.getElementById('btnSignin');
const formRegister = document.getElementById('formregister');

const navegar = ()=>{
    setTimeout(()=>{
        window.location.replace('/login')
    }, 3000)
}

btnSigin.addEventListener('click', async(e)=>{
    e.preventDefault();
    const data = new FormData(formRegister);
    const objeto={};
    data.forEach((value,key)=>objeto[key]=value);
    const err = 'Missing credentials';

    const response = await fetch('https://blog-luz-en-el-camino-production.up.railway.app/api/session/register', {
        method:'POST',
        body : JSON.stringify(objeto),
        headers:{
            'Content-Type':"application/json",
            },
    })
    const json = await response.json();
    if(json.error){
        if(json.error === err) errorFieldRegister.innerHTML = `<p>Debes proporcionar todos los datos</p>`;
        else errorFieldRegister.innerHTML = `<p>${json.error}</p>`;
    } else{
        Toastify({
            text: json.message,
            duration: 3000,
            callback: navegar()
            }).showToast();
    }
})