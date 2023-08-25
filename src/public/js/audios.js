const borrarmp3 = async(id)=>{
    const response = await fetch(`https://blog-luz-en-el-camino-production.up.railway.app/api/audio/${id}`, {
        method:'DELETE'
    })

    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
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