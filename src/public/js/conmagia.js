const comentar = async(id)=>{
    const formComent = document.getElementById(`formComent${id}`);
    const inptTxt = document.getElementById(`txt${id}`);
    const inptName = document.getElementById(`name${id}`);
    const name = inptName.value;
    const succes = 'succes';
    
    if(!name){
        const response = await fetch(`http://localhost:8007/api/pdf/${id}`, {
            method:'POST',
            body: JSON.stringify({text: inptTxt.value}),
            headers:{
                "Content-Type":'application/json'
            }
        })
        const json = await response.json();
        if(json.status === succes){
            Toastify({
                text: json.message,
                duration: 3000,
                }).showToast();
        } else {
            Toastify({
                text: json.error,
                duration: 3000,
                }).showToast();
        }
    } else {
        const response = await fetch(`http://localhost:8007/api/pdf/${id}`, {
            method:'POST',
            body: JSON.stringify({name: name, text: inptTxt.value}),
            headers:{
                "Content-Type":'application/json'
            }
        })
        const json = await response.json();
        if(json.status === succes) {
            Toastify({
                text: json.message,
                duration: 3000,
                }).showToast();
        } else {
            Toastify({
                text: json.error,
                duration: 3000,
                }).showToast();
        }
    }
}