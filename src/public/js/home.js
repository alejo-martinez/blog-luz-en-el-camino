const logout = async()=>{
    const response= await fetch('https://luzenelcamino.com.ar/api/session/login', {
        method:'DELETE'
    })
    const json = await response.json();
    if(json.status === 'succes'){
        window.location.href = window.location.href;
    }
}