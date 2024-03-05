registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = registerForm['username'].value;
    const email = registerForm['email'].value;
    const password = registerForm['password'].value;
    const roles = registerForm['rol'].value;

    axios.post('/api/auth/signup', { username, email, password, roles: [roles] })
        .then(res => {
            if (res.status === 200) {
                window.location.href = "/login";
            }
        }).catch(err => {
            document.getElementById("error-message").innerHTML = err.response.data.message;
        });
});