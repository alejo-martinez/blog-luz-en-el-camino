const borrarmp3 = async(id)=>{
    const response = await fetch(`http://localhost:8007/api/audio/${id}`, {
        method:'DELETE'
    })

    const json = await response.json();
    console.log(json);
}