

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();


    const username = loginForm['username'].value;
    const password = loginForm['password'].value;

    axios.post('/api/auth/signin', { username, password })
        .then(res => {
            if (res.data.accessToken) {
                window.location.href = "/profile";
            }
        }).catch(err => {
            document.getElementById("error-message").innerHTML = err.response.data.message;
        }); 
});