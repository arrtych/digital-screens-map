// const btnLogin = document.getElementById("btn-login");
const loginForm = document.getElementById("login-form");
var loginFormUsername = document.getElementById("loginFormUsername");
var loginFormPassword = document.getElementById("loginFormPassword");



loginForm.addEventListener("submit", function (evt) { // submit saveAddRoom form(Add room)
    evt.preventDefault();
    var obj = {
        "username": loginFormUsername.value.trim(),
        "password": loginFormPassword.value.trim()
    };
    loginForm.classList.add('was-validated');
    crudUser.Login(obj);
    // crudUser.TestLogin(obj);

    console.log("login form submitted");
});


