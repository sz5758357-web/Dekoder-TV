function loadChannel(name){
    document.getElementById("title").textContent = name;

    // Tutaj wstawiasz legalny adres transmisji,
    // jeśli masz do niej uprawnienia.
    document.getElementById("video").src = "";
}
