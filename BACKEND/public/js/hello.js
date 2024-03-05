function readCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; ++i) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

window.onload = function(){

    axios.get('/api/test/all').then(res => {
        document.getElementById("counter").innerHTML = `Actualmente contamos con ${res.data.counter} usuarios registrados`;
    });

    axios.get('/api/test/user', { headers: { 'x-access-token': readCookie('user') } })
        .then(res => {
            document.getElementById("hello").innerHTML = `¡Hola ${res.data.user}! para ver tu perfil, haz click <a href="/profile">aquí</a>`;
        }).catch(err => {
            document.getElementById("hello").innerHTML = `¡Hola! Para iniciar sesión, haz click <a href="/login">aquí</a>`;
        });

};