const logout = async()=>{
    const response= await fetch('https://blog-luz-en-el-camino-production.up.railway.app/api/session/login', {
        method:'DELETE'
    })
    const json = await response.json();
    if(json.status === 'succes'){
        window.location.href = window.location.href;
    }
}