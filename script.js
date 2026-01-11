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

        // Bandome rasti elementą pagal ID (čia bus SPAN polygon kabinetuose)
        let el = document.getElementById(k.id);

        if (el) {
            el.textContent = k.kabinetas; // įrašome kabineto numerį į SPAN arba DIV
            return;
        }

        // Jei ID nerastas → polygon kabinetas su klase .kabinetas<ID>
        el = document.querySelector(".kabinetas" + k.id);
        if (el) {
            const span = el.querySelector("span[id]");
            if (span) span.textContent = k.kabinetas;
        }
    });


    // -------- 2) Paspaudus ant kabineto plane --------
    document.querySelectorAll(".kabinetas").forEach(kab => {
      kab.addEventListener("click", () => {

        let id = kab.id; // Jei kabinetas turi ID ant DIV

        // Jei ID nėra ant DIV → polygon kabinetas → ID yra SPAN viduje
        if (!id) {
          const span = kab.querySelector("span[id]");
          if (span) id = span.id;
        }

        if (!id) return; // Jei vis dar nėra ID — išeiname

        // Randame info pagal ID
        const info = cfg.info.find(i => String(i.id) === String(id));

        // Kabineto numeris iš teksto
        const kabPavad =
            kab.textContent.trim() ||
            document.getElementById(id)?.textContent.trim();

        // Rodome info panelėje
        document.getElementById("infoKabinetas").textContent = kabPavad || " ";
        document.getElementById("infoPareigos").textContent = info?.pareigos || " ";
        document.getElementById("infoVardas").textContent = info?.vardas_pavarde || " ";
        document.getElementById("infoDelKo").textContent =
            info?.del_ko_kreiptis?.join("\n") || " ";

        document.getElementById("info").style.display = "block";

        highlightKabinetas(id);
      });
    });



    // ====================== 3) SEARCH SISTEMA ======================
    const search = document.getElementById("search");
    const searchList = document.getElementById("search-list");
    

    // pavertimas info į masyvą
const people = Object.keys(cfg.info).map(id => ({
    id: id,
    ...cfg.info[id]
})).sort((a, b) => {

    const hasNameA = a.vardas_pavarde && a.vardas_pavarde.trim() !== "";
    const hasNameB = b.vardas_pavarde && b.vardas_pavarde.trim() !== "";

    // jei A neturi vardo → apačion
    if (!hasNameA && hasNameB) return 1;

    // jei B neturi vardo → A aukščiau
    if (hasNameA && !hasNameB) return -1;

    // jei abu turi / neturi vardus → rikiuoti abėcėline tvarka
    return (a.vardas_pavarde || "").localeCompare(b.vardas_pavarde || "");
});


    // -------- Rodyti VISĄ sąrašą --------
    function renderFullList() {
        searchList.innerHTML = "";

        people.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-item";

            div.innerHTML = `
                <div class="pareigos">${p.pareigos}</div>
                <div class="vardas">${p.vardas_pavarde}</div>
            `;

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
            p.vardas_pavarde.toLowerCase().includes(q) ||
            p.pareigos.toLowerCase().includes(q)
        );

        searchList.innerHTML = "";

        filtered.forEach(p => {
            const div = document.createElement("div");
            div.className = "search-item";

            div.innerHTML = `
                <div class="pareigos">${p.pareigos}</div>
                <div class="vardas">${p.vardas_pavarde}</div>
            `;

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
        const info = cfg.info.find(i => String(i.id) === String(id));

        if (!info) {
            alert("Tokio žmogaus informacijos nėra.");
            return;
        }

        if (!kab) {
            alert("Šiam žmogui nepriskirtas kabinetas.");
            return;
        }

        // Užpildyti info panelę
        document.getElementById("infoKabinetas").textContent = kab.kabinetas;
        document.getElementById("infoPareigos").textContent = info.pareigos;
        document.getElementById("infoVardas").textContent = info.vardas_pavarde;
        document.getElementById("infoDelKo").textContent = info.del_ko_kreiptis.join("\n");

        document.getElementById("info").style.display = "block";

        highlightKabinetas(kab.id);
    }


    // ======================= 5) Pažymėti kabinetą + perjungti aukštą =======================
    function highlightKabinetas(id) {

    lastKabId = id; // ← ČIA ĮDEDAM !!!

    // nuimti seną highlight
    document.querySelectorAll(".kabinetas").forEach(k =>
        k.classList.remove("active-kabinetas")
    );

    const el = document.getElementById(id) || document.querySelector(".kabinetas" + id);
    if (!el) return;

    // uždėti highlight
    el.classList.add("active-kabinetas");

    // surasti aukštą
    let aukstas =
        el.closest(".pirmas-aukstas") ? "pirmas-aukstas" :
        el.closest(".antras-aukstas") ? "antras-aukstas" :
        "trecias-aukstas";

    // perjungti aukštą
    aukstai.forEach(a => a.style.display = "none");
    document.querySelector("." + aukstas).style.display = "block";
}


}); // fetch end

document.querySelector(".speaker").addEventListener("click", () => {

    if (!lastKabId) {
        alert("Pirmiausia pasirink kabinetą plane arba iš sąrašo.");
        return;
    }

    const audio = document.getElementById("audioPlayer");
    const newSrc = `audio/${lastKabId}.m4a`;

    // jei paspausta antrą kartą ir tas pats garsas – toggle play/pause
    if (audio.src.includes(newSrc)) {
        if (!audio.paused) {
            audio.pause();
        } else {
            audio.play();
        }
        return;
    }

    // jei kitas kabinetas – kraunam naują garsą
    audio.src = newSrc;
    audio.play().catch(() => {
        alert("Šiam kabinetui garsas nepridėtas.");
    });

});


