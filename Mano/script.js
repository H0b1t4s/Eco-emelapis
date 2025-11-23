// Rodyti pirmą aukštą pagal klasę
document.querySelector(".pirmas-aukstas").style.display = "block";

const mygtukai = document.querySelectorAll(".aukstas-btn");
const aukstai = document.querySelectorAll(".pirmas-aukstas, .antras-aukstas, .trecias-aukstas");

// Pirmam mygtukui uždedam ACTIVE
mygtukai[0].classList.add("active");

mygtukai.forEach(btn => {
    btn.addEventListener("click", () => {
        const aukstas = btn.dataset.aukstas;

        // Paslėpti visus aukštus
        aukstai.forEach(a => a.style.display = "none");

        // Parodyti pasirinktą
        document.querySelector("." + aukstas).style.display = "block";

        // Nuimti active nuo visų mygtukų
        mygtukai.forEach(m => m.classList.remove("active"));

        // Šitam mygtukui uždėti active
        btn.classList.add("active");
    });
});

fetch("config.json")
  .then(response => response.json())
  .then(data => {
    data.kabinetai.forEach(item => {
      const blokas = document.getElementById(item.id);
      if (blokas) {
        blokas.querySelector(".kabinetas").textContent = item.kabinetas;
      }
    });
  });