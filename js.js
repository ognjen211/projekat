// Učitavanje postojećih podsetnika iz localStorage
let podsetnici = JSON.parse(localStorage.getItem('podsetnici')) || [];

// Funkcija za prikazivanje liste
function prikaziPodsetnike() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    // Sortiranje prema vremenu
    podsetnici.sort((a, b) => new Date(a.vreme) - new Date(b.vreme));

    podsetnici.forEach((p, index) => {
        const li = document.createElement('li');

        // Tekst podsetnika
        li.innerHTML = `
            <div>
                <strong>${p.naslov}</strong><br>
                <small>${new Date(p.vreme).toLocaleString()}</small>
            </div>
        `;

        // Dugme za brisanje
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '<i class="fas fa-trash"></i>';
        btnDelete.className = 'delete-btn';
        btnDelete.onclick = () => {
            brisiPodsetnik(index);
        };

        li.appendChild(btnDelete);
        lista.appendChild(li);
    });
}

// Funkcija za dodavanje podsetnika
document.getElementById('podsetnikForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const naslov = document.getElementById('naslov').value.trim();
    const vreme = document.getElementById('vreme').value;

    if (naslov && vreme) {
        const novi = { naslov, vreme };
        podsetnici.push(novi);
        localStorage.setItem('podsetnici', JSON.stringify(podsetnici));
        prikaziPodsetnike();
        alert(`Podsetnik "${naslov}" je dodat!`);
        // Reset forme
        this.reset();
        // Provera za podsetnik
        proveriPodsetnik(novi);
    }
});

// Funkcija za brisanje
function brisiPodsetnik(index) {
    const ukloni = podsetnici.splice(index, 1);
    localStorage.setItem('podsetnici', JSON.stringify(podsetnici));
    prikaziPodsetnike();
    alert(`Podsetnik "${ukloni[0].naslov}" je obrisan.`);
}

// Provera i notifikacije
function proveriPodsetnik(podsetnik) {
    const sada = new Date();
    const vremePodsetnika = new Date(podsetnik.vreme);
    const razlika = vremePodsetnika - sada;

    if (razlika > 0 && razlika <= 60000) { // Ako je u sledećih 60 sekundi
        setTimeout(() => {
            alert(`Podsetnik: ${podsetnik.naslov}`);
        }, razlika);
    }
}

// Automatski proveri sve podsetnike prilikom učitavanja
function proveriSvePodsetnike() {
    const sada = new Date();
    podsetnici.forEach(p => {
        proveriPodsetnik(p);
    });
}

// Inicijalno prikazivanje
prikaziPodsetnike();
proveriSvePodsetnike();

  