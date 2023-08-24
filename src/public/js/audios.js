const borrarmp3 = async(id)=>{
    const response = await fetch(`https://blog-luz-en-el-camino-production.up.railway.app/api/audio/${id}`, {
        method:'DELETE'
    })

    const json = await response.json();
    console.log(json);
}