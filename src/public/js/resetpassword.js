const inputPass = document.getElementById('pass');
const inputConfirmPass = document.getElementById('confirmpass');
const btnReset = document.getElementById('btnReset');
const errorfield = document.getElementById('errorfieldpassword');
const container = document.getElementById('containerId');

function updateErrorMessage() {
    if (inputPass.value === "" && inputConfirmPass.value === "") {
        errorfield.innerHTML = '<span class="span-error-pass">Ingresa una contraseña</span>';
    } else if (inputPass.value !== inputConfirmPass.value) {
        errorfield.innerHTML = '<span class="span-error-pass">Las contraseñas no coinciden</span>';
    } else {
        errorfield.innerHTML = '<span class="span-succes-pass">Las contraseñas coinciden</span>';
    }
}

inputPass.addEventListener('input', updateErrorMessage);
inputConfirmPass.addEventListener('input', updateErrorMessage);

btnReset.addEventListener('click', async (e) => {
    e.preventDefault();

    const password = inputPass.value;
    const uid = container.getAttribute('data-uid');

    const response = await fetch(`/session/update/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ password: password }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const json = await response.json();
    if (json.status === 'succes') {
        window.location.href = '/';
    } else {
        errorfield.innerHTML = `<span class="span-error-pass">${json.error}</span>`;
    }
})