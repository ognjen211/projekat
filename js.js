// Dohvati elemente
const userIcon = document.getElementById('userIcon');
const authForms = document.getElementById('authForms');

// Klik na ikonicu za otvaranje login forme
userIcon.addEventListener('click', () => {
    if (authForms.style.display === "none" || authForms.innerHTML === "") {
        showLoginForm();
        authForms.style.display = "block";
    } else {
        authForms.style.display = "none";
    }
});

// Funkcija za prikaz login forme
function showLoginForm() {
    authForms.innerHTML = `
        <form id="loginForm">
            <h2>Prijava</h2>
            <input type="email" id="loginEmail" placeholder="Email" required>
            <input type="password" id="loginPassword" placeholder="Lozinka" required>
            <button type="submit">Prijavi se</button>
        </form>
        <p style="text-align:center; color:white;">Nemate nalog? 
            <span id="showSignUp" style="text-decoration:underline; cursor:pointer;">Registrujte se</span>
        </p>
    `;

    // Klik na "Registrujte se"
    document.getElementById('showSignUp').addEventListener('click', showSignUpForm);

    // Funkcija za login
    document.getElementById('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        login();
    });
}

// Funkcija za prikaz registracione forme
function showSignUpForm() {
    authForms.innerHTML = `
        <form id="signUpForm">
            <h2>Registracija</h2>
            <input type="email" id="signUpEmail" placeholder="Email" required>
            <input type="password" id="signUpPassword" placeholder="Lozinka" required>
            <button type="submit">Registruj se</button>
        </form>
        <p style="text-align:center; color:white;">Već imate nalog? 
            <span id="showLogin" style="text-decoration:underline; cursor:pointer;">Prijavite se</span>
        </p>
    `;

    // Klik na "Prijavite se"
    document.getElementById('showLogin').addEventListener('click', showLoginForm);

    // Funkcija za registraciju
    document.getElementById('signUpForm').addEventListener('submit', function (e) {
        e.preventDefault();
        signUp();
    });
}

// Funkcija za registraciju korisnika
function signUp() {
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();

    if (!email || !password) {
        alert("Popunite sva polja!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Provera da li korisnik već postoji
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("Korisnik već postoji!");
    } else {
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        document.cookie = "signup=success; max-age=3600";
        alert("Uspešno ste se registrovali!");
        showLoginForm();
    }
}

// Funkcija za login korisnika
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Provera da li korisnik postoji
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        document.cookie = "login=success; max-age=3600";
        alert("Uspešno ste se prijavili!");
        authForms.style.display = "none";
    } else {
        alert("Pogrešan email ili lozinka!");
    }
}
