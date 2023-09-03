const btnLogin = document.getElementById('btnLogin');
const errorFieldLogin = document.getElementById('errorfieldlogin');
const formLogin = document.getElementById('formlogin');

const error = 'error';

function redireccionarAPaginaAnterior() {
  const referrer = document.referrer;
    if (referrer.includes('/register') || !referrer.includes('localhost')) {
      window.location.href = '/';
    } else {
      window.location.replace(referrer);
    }
  }

btnLogin.addEventListener('click', async (e)=>{
    e.preventDefault();
    const data = new FormData(formLogin);
    const objeto={};
    data.forEach((value,key)=>objeto[key]=value);
    const err = 'Missing credentials';

    const response = await fetch('https://luzenelcamino.com.ar/api/session/login', {
        method:'POST',
        headers:{
            'Content-Type':"application/json",
            },
        body: JSON.stringify(objeto)
    })
    const json = await response.json();
    if(json.error){
        if(json.error === err) errorFieldLogin.innerHTML = `<p>Debes proporcionar todos los datos</p>`;
        else errorFieldLogin.innerHTML = `<p>${json.error}</p>`;
    } else{
        redireccionarAPaginaAnterior();
    }
})