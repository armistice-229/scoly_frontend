// =================== Départements & Communes ===================
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

// =================== FedaPay + Génération ===================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("certificat-form");
  const submitBtn = document.getElementById("btnCheckout");

  // Tooltip (info bulle)
  submitBtn.setAttribute("title", "Le certificat sera disponible après paiement sécurisé.");

  // Initialisation du widget FedaPay
  FedaPay.init('#btnCheckout', {
    public_key: "pk_live_2dkPm2oKI6Jl9fDN2tnfmCN7", // ⚠️ Mets ta clé publique live en prod
    transaction: {
      description: "Certificat de scolarité",
      amount: 250,
      currency: "XOF"
    },
    customer: {
          email: 'johndoe@gmail.com',
          lastname: 'Doe',
          firstname: 'John',
    },
    onComplete: async (response) => {
      if (response.transaction.status === "approved") {
        // Paiement validé ✅ → Génération du certificat
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
          submitBtn.classList.add("loading");
          submitBtn.disabled = true;

          const res = await fetch("https://scoly-backend.onrender/api/certificat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });

          if (!res.ok) throw new Error("Erreur lors de la génération du certificat");

          const blob = await res.blob();
          const pdfUrl = URL.createObjectURL(blob);

          // Téléchargement auto
          const a = document.createElement("a");
          a.href = pdfUrl;
          a.download = "certificat.pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();

        } catch (err) {
          alert("❌ " + err.message);
        } finally {
          submitBtn.classList.remove("loading");
          submitBtn.disabled = false;
        }
      } else {
        alert("❌ Paiement non validé");
      }
    }
  });

  // Empêche le comportement natif du formulaire
  form.addEventListener("submit", (e) => e.preventDefault());
});
// =================== Fin ===================
// Note: N'oublie pas de remplacer la clé publique FedaPay par ta clé live en production.
// Note: Le serveur backend doit être en cours d'exécution pour que la génération fonctionne.
