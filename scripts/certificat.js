  // Données des départements et communes du Bénin
  const data = {
    "Alibori": ["Banikoara", "Gogounou", "Kandi", "Karimama", "Malanville", "Ségbana"],
    "Atacora": ["Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Natitingou", "Péhunco", "Tanguiéta", "Toucountouna"],
    "Atlantique": ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "So-Ava", "Toffo", "Tori-Bossito", "Zè"],
    "Borgou": ["Bembèrèkè", "Kalalé", "N'Dali", "Nikki", "Parakou", "Pèrèrè", "Sinendé", "Tchaourou"],
    "Collines": ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"],
    "Couffo": ["Aplahoué", "Djakotomey", "Dogbo", "Lalo", "Toviklin", "Klouékanmè"],
    "Donga": ["Bassila", "Copargo", "Djougou", "Ouaké"],
    "Littoral": ["Cotonou"],
    "Mono": ["Athiémè", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"],
    "Ouémé": ["Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Porto-Novo", "Sèmè-Podji"],
    "Plateau": ["Ifangni", "Kétou", "Pobè", "Adja-Ouèrè", "Sakété"],
    "Zou": ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Zagnanado", "Za-Kpota", "Zogbodomey"]
  };

  const departementSelect = document.getElementById("departement");
  const communeSelect = document.getElementById("ville");

  // Remplir les départements
  Object.keys(data).forEach(dep => {
    const option = document.createElement("option");
    option.value = dep;
    option.textContent = dep;
    departementSelect.appendChild(option);
  });

  // Quand on choisit un département
  departementSelect.addEventListener("change", function () {
    communeSelect.innerHTML = '<option value="">-- Sélectionner une commune --</option>';
    if (this.value) {
      data[this.value].forEach(commune => {
        const option = document.createElement("option");
        option.value = commune;
        option.textContent = commune;
        communeSelect.appendChild(option);
      });
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("certificat-form");
  const modal = document.getElementById("certificat-modal");
  const modalContent = modal.querySelector(".modal-content") || modal.children[0];
  const modalClose = modal.querySelector(".modal-close");
  const previewContainer = modal.querySelector(".certificat-preview");
  const downloadBtn = modal.querySelector(".btn-download");
  const submitBtn = form.querySelector(".btn-primary");

  // 🔹 Fonction pour ouvrir le modal avec animation
  function openModal(pdfUrl) {
    // injection preview
    previewContainer.innerHTML = "";
    if (window.innerWidth > 768) {
      const iframe = document.createElement("iframe");
      iframe.src = pdfUrl;
      iframe.width = "100%";
      iframe.height = "500px";
      iframe.className = "rounded-lg border";
      previewContainer.appendChild(iframe);
    } else {
      previewContainer.innerHTML = "<p class='text-gray-600 italic'>Aperçu non disponible sur mobile</p>";
    }

    // config téléchargement
    downloadBtn.onclick = () => {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "certificat.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    };

    // afficher avec animation
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      modal.children[0].classList.remove("scale-95");
    }, 10);
  }

  // 🔹 Fonction pour fermer le modal avec animation
  function closeModal() {
    modal.classList.add("opacity-0");
    modal.children[0].classList.add("scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
  }

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Active le spinner
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      
      const response = await fetch("https://scoly-backend.onrender.com/api/certificat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Erreur lors de la génération du certificat");

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);

      openModal(pdfUrl);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
    // Désactive le spinner une fois terminé
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  }

  });

  // Fermeture du modal
  modalClose.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
});
