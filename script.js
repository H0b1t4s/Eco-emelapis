// ======================= RODYTI 1 AUKŠTĄ START'E =======================
document.querySelector(".pirmas-aukstas").style.display = "block";

const mygtukai = document.querySelectorAll(".aukstas-btn");
const aukstai = document.querySelectorAll(".pirmas-aukstas, .antras-aukstas, .trecias-aukstas");

// nustatom ACTIVE pirmam mygtukui
mygtukai[0].classList.add("active");

mygtukai.forEach(btn => {
    btn.addEventListener("click", () => {
        const aukstas = btn.dataset.aukstas;

        aukstai.forEach(a => a.style.display = "none");
        document.querySelector("." + aukstas).style.display = "block";

        mygtukai.forEach(m => m.classList.remove("active"));
        btn.classList.add("active");
    });
});


// ======================= FETCH CONFIG =======================
fetch("config.json")
  .then(res => res.json())
  .then(cfg => {

    // -------- 1) Kabinetų numeriai ant plano --------
    cfg.kabinetai.forEach(k => {
      const el = document.getElementById(k.id);
      if (el) el.textContent = k.kabinetas;
    });


    // -------- 2) Paspaudus ant kabineto plane --------
    document.querySelectorAll(".kabinetas").forEach(kab => {
      kab.addEventListener("click", () => {
        const id = kab.id;
        const info = cfg.info[id];

        document.getElementById("infoKabinetas").textContent = kab.textContent;
        document.getElementById("infoPareigos").textContent = info?.pareigos || "—";
        document.getElementById("infoVardas").textContent = info?.vardas_pavarde || "—";
        document.getElementById("infoDelKo").textContent = info?.del_ko_kreiptis || "—";

        document.getElementById("info").style.display = "block";
      });
    });


    // ======================= 3) SEARCH SISTEMA =======================

    const search = document.getElementById("search");
    const searchList = document.getElementById("search-list");

    // pavertimas info į masyvą
    const people = Object.keys(cfg.info).map(id => ({
        id: id,
        ...cfg.info[id]
    }));


    // -------- Rodyti VISĄ sąrašą --------
    function renderFullList() {
        searchList.innerHTML = "";

        people.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-item";
            div.textContent = p.vardas_pavarde;

            div.onclick = () => {
                pickPerson(p.id);
                search.value = p.vardas_pavarde;
            };

            searchList.appendChild(div);
        });
    }

    renderFullList();


    // -------- Filtravimas --------
    search.addEventListener("input", () => {
        const q = search.value.toLowerCase();

        if (!q.trim()) {
            renderFullList();
            return;
        }

        const filtered = people.filter(p =>
            p.vardas_pavarde.toLowerCase().includes(q)
        );

        searchList.innerHTML = "";

        filtered.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-item";
            div.textContent = p.vardas_pavarde;

            div.onclick = () => {
                pickPerson(p.id);
                search.value = p.vardas_pavarde;
            };

            searchList.appendChild(div);
        });
    });


    // ======================= 4) Pasirinkus žmogų iš sąrašo =======================
    function pickPerson(id) {
        const kab = cfg.kabinetai.find(k => String(k.id) === String(id));
        const info = cfg.info[id];

        if (!kab) {
            alert("Šiam žmogui nepriskirtas kabinetas.");
            return;
        }

        // Užpildyti info panelę
        document.getElementById("infoKabinetas").textContent = kab.kabinetas;
        document.getElementById("infoPareigos").textContent = info.pareigos;
        document.getElementById("infoVardas").textContent = info.vardas_pavarde;
        document.getElementById("infoDelKo").textContent = info.del_ko_kreiptis;

        document.getElementById("info").style.display = "block";

        highlightKabinetas(kab.id);
    }



    // ======================= 5) Pažymėti kabinetą + perjungti aukštą =======================
    function highlightKabinetas(id) {

        // nuimti seną highlight
        document.querySelectorAll(".kabinetas").forEach(k =>
            k.classList.remove("active-kabinetas")
        );

        const el = document.getElementById(id);
        if (!el) return;

        // uždėti highlight
        el.classList.add("active-kabinetas");

        // surasti aukštą
        let aukstas = el.closest(".pirmas-aukstas") ? "pirmas-aukstas" :
                      el.closest(".antras-aukstas") ? "antras-aukstas" :
                      "trecias-aukstas";

        // perjungti aukštą
        aukstai.forEach(a => a.style.display = "none");
        document.querySelector("." + aukstas).style.display = "block";
    }

});
