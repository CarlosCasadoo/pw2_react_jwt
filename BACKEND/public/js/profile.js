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

    axios.get('/api/test/user', { headers: { 'x-access-token': readCookie('user') } })
        .then(res => {
            document.getElementById("heading").innerHTML = `¡Hola ${res.data.user}!`;
            document.getElementById("email").innerHTML = `Tu correo es: ${res.data.email}`;
            document.getElementById("createdAt").innerHTML = `Te creaste la cuenta el: ${res.data.createdAt}`;
            document.getElementById("content").innerHTML = `Mensaje: ${res.data.message}`;
        }).catch(err => {
            window.location.href = "/login";
        });

};