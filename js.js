let isLogin = true;
let currentUser = null;


document.getElementById('signInButton').addEventListener('click', handleAuthButtonClick);


document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('authPopup').classList.add('hidden');
});


function handleAuthButtonClick() {
    if (currentUser) {
      
        if (confirm('Da li želite da se izlogujete?')) {
            currentUser = null;
            updateSignInButton();
            alert('Uspešno ste se izlogovali.');
            loadReminders(); 
        }
    } else {
        
        document.getElementById('authPopup').classList.remove('hidden');
    }
}


document.addEventListener('click', function(e) {
    if (e.target && e.target.id == 'switchForm') {
        const title = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitAuth');
        const toggleText = document.querySelector('.toggleForm');

        if (isLogin) {
            isLogin = false;
            title.textContent = 'Registracija';
            submitBtn.textContent = 'Registruj se';
            toggleText.innerHTML = 'Već imate nalog? <span id="switchForm">Prijavite se</span>';
        } else {
            isLogin = true;
            title.textContent = 'Prijava';
            submitBtn.textContent = 'Prijavi se';
            toggleText.innerHTML = 'Nemate nalog? <span id="switchForm">Registrujte se</span>';
        }
    }
});


document.getElementById('submitAuth').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert("Popunite sva polja.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (isLogin) {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            currentUser = username;
            alert("Uspešno ste prijavljeni!");
            document.getElementById('authPopup').classList.add('hidden');
            updateSignInButton();
            loadReminders();
        } else {
            alert("Pogrešno korisničko ime ili lozinka.");
        }
    } else {
        if (users.find(u => u.username === username)) {
            alert("Korisničko ime već postoji!");
            return;
        }
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Uspešna registracija!");
        isLogin = true;
        document.getElementById('formTitle').innerText = "Prijava";
        document.getElementById('submitAuth').innerText = "Prijavi se";
        document.querySelector('.toggleForm').innerHTML = 'Nemate nalog? <span id="switchForm">Registrujte se</span>';
    }
});


function updateSignInButton() {
    const signInBtn = document.getElementById('signInButton');
    if (currentUser) {
        signInBtn.innerHTML = `<i class="fas fa-user-check"></i> ${currentUser}`;
    } else {
        signInBtn.innerHTML = `<i class="fas fa-user"></i> Sign in`;
    }
}


document.getElementById('reminderForm').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert("Morate biti ulogovani da biste dodali podsetnik.");
        document.getElementById('authPopup').classList.remove('hidden');
        return;
    }

    const naslov = document.getElementById('naslov').value;
    const datum = document.getElementById('datum').value;
    const vreme = document.getElementById('vreme').value;

    const reminder = { naslov, datum, vreme };

    let reminders = JSON.parse(localStorage.getItem(currentUser + "_reminders")) || [];
    reminders.push(reminder);
    localStorage.setItem(currentUser + "_reminders", JSON.stringify(reminders));

    document.getElementById('reminderForm').reset();
    loadReminders();
});


function loadReminders() {
    const remindersContainer = document.getElementById('remindersList');
    remindersContainer.innerHTML = '';

    if (!currentUser) return;

    const reminders = JSON.parse(localStorage.getItem(currentUser + "_reminders")) || [];

    if (reminders.length === 0) {
        remindersContainer.innerHTML = '<p>Nemate sačuvanih podsetnika.</p>';
        return;
    }

    reminders.forEach((reminder, index) => {
        const div = document.createElement('div');
        div.className = 'reminder';
        div.innerHTML = `
            <h3>${reminder.naslov}</h3>
            <p>Datum: ${reminder.datum}</p>
            <p>Vreme: ${reminder.vreme}</p>
            <button class="delete-btn" data-index="${index}">Obriši</button>
        `;
        remindersContainer.appendChild(div);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            let reminders = JSON.parse(localStorage.getItem(currentUser + "_reminders"));
            reminders.splice(index, 1);
            localStorage.setItem(currentUser + "_reminders", JSON.stringify(reminders));
            loadReminders();
        });
    });
}

window.addEventListener('load', () => {
    updateSignInButton();
    loadReminders();
});
let triggeredReminders = [];

function checkReminders() {
    if (!currentUser) return;

    const reminders = JSON.parse(localStorage.getItem(currentUser + "_reminders")) || [];

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // yyyy-mm-dd
    const currentTime = now.toTimeString().split(' ')[0].slice(0,5); // hh:mm

    reminders.forEach((reminder, index) => {
        if (reminder.datum === currentDate && reminder.vreme === currentTime) {
            const reminderId = `${currentUser}_${index}`;

            if (!triggeredReminders.includes(reminderId)) {
               
                alert(`⏰ Podsetnik: "${reminder.naslov}" je sada!`);
                
                
                triggeredReminders.push(reminderId);
            }
        }
    });
}


setInterval(checkReminders, 10000);
