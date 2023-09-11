const recargar = ()=>{
    setTimeout(()=>{
        window.location.href = window.location.href;
    }, 2000)
}

const sendMessage = async (id) => {
    const input = document.getElementById(`message${id}`);
    const data = input.value;
    const response = await fetch('/api/user/admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: data, id: id })
    });
    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 3000,
            }).showToast();
            input.value = ''
    } else{
        Toastify({
            text: json.error,
            duration: 3000,
            }).showToast();
    }
}

const deleteChat = async(id)=>{
    const response = await fetch(`/api/user/chat/${id}`, {
        method:'DELETE'
    });
    const json = await response.json();
    if(json.status === 'succes'){
        Toastify({
            text: json.message,
            duration: 2000,
            callback: recargar()
            }).showToast();
    } else {
        Toastify({
            text: json.error,
            duration: 2000,
            }).showToast();
    }
}