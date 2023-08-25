const sendMessage = async (id) => {
    const input = document.getElementById(`message${id}`);
    const data = input.value;
    const response = await fetch('https://luzenelcamino.up.railway.app/api/user/admin', {
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
