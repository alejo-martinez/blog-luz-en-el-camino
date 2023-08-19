// 

const logout = async()=>{
    const response= await fetch('http://localhost:8007/api/session/login', {
        method:'DELETE'
    })
    const json = await response.json();
    if(json.status === 'succes'){
        window.location = '/';
    }
}