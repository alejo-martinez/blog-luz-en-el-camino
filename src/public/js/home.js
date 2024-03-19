const logout = async () => {
    const response = await fetch('/api/session/login', {
        method: 'DELETE'
    })
    const json = await response.json();
    if (json.status === 'succes') {
        if (window.location.href.includes('/chat') || window.location.href.includes('/uploadpdf') || window.location.href.includes('/uploadaudio') || window.location.href.includes('/uploadvideo')) window.location.href = '/';
        else window.location.href = window.location.href;
    }
}

if (window.location.pathname === '/') {
    const btnDivChat = document.getElementById('btnDivChat');
    btnDivChat.style.top = '160px';
}