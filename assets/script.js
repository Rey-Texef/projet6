const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"
const gallery = document.querySelector(".gallery")
const filtresPos = document.querySelector(".filtres")
const boutonTous = document.getElementById("tous")

boutonTous.classList.add("boutonFiltreClic")
boutonTous.classList.remove("boutonFiltre")
recupWorks()
recupCategories()
affichAllWorks()
afficherCategories()
const token = localStorage.getItem("authToken")
if (token) {
  const logBouton = document.querySelector(".loginBouton")
  logBouton.textContent = "logout"
  logBouton.addEventListener("click", function() {
    localStorage.removeItem("authToken")
  })
  const modalBouton = document.getElementById("openModal")
  const iconModal = document.getElementById("iconModal")
  modalBouton.style.visibility = "visible"
  iconModal.style.visibility = "visible"
}
else {
  console.log("Aucun token trouvé dans le localStorage")
}

async function recupWorks() {
  try {
      let reponse = await fetch(worksUrl)
      if (!reponse.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
      }
      let data = await reponse.json()
      let dataJson = await JSON.stringify(data)
      localStorage.setItem("works", dataJson)
  } catch (erreur) {
      console.error("Une erreur s'est produite : ", erreur)
  }
}

async function recupCategories() {
  try {
      let reponse = await fetch(categoriesUrl)
      if (!reponse.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
      }
      let data = await reponse.json()
      let dataJson = await JSON.stringify(data)
      localStorage.setItem("categories", dataJson)
  } catch (erreur) {
      console.error("Une erreur s'est produite : ", erreur)
  }
}

async function affichAllWorks() {
  gallery.innerHTML = ""
  const data = localStorage.getItem("works")
  const worksArray = JSON.parse(data)
  worksArray.forEach(item => {
      const fig = document.createElement("figure")
      const img = document.createElement("img")
      const title = item.title
      const image = item.imageUrl
      img.src = image
      img.alt = title
      const titre = document.createElement("figcaption")
      titre.textContent = title
      gallery.appendChild(fig)
      fig.appendChild(img)
      fig.appendChild(titre)
      let boutFilt = document.getElementById("tous")
      boutFilt.classList.add("boutonFiltreClic")
  }) 
}

async function afficherCategories() {
  const data = localStorage.getItem("categories")
  const categoriesArray = JSON.parse(data)
  const boutonTous = document.getElementById("tous")
  if (boutonTous == null) {
    const boutFilt = document.createElement("button")
    boutFilt.classList.add("boutonFiltre")
    boutFilt.id = "tous"
    boutFilt.textContent = "Tous"
    filtresPos.appendChild(boutFilt)
    document.getElementById("tous").addEventListener("click", function() {
      filtresPos.innerHTML = ""
      const boutFilt = document.createElement("button")
      boutFilt.classList.add("boutonFiltreClic")
      boutFilt.id = "tous"
      boutFilt.textContent = "Tous"
      filtresPos.appendChild(boutFilt)
      affichAllWorks()
      afficherCategories()

    })
  }
  categoriesArray.forEach(item => {
    const boutFilt = document.createElement("button")
    boutFilt.classList.add("boutonFiltre")
    boutFilt.id = item.id
    boutFilt.textContent = item.name
    filtresPos.appendChild(boutFilt)
    boutFilt.addEventListener("click", function(event) {
        const categoriesId = event.currentTarget.id
        affichCatWorks(categoriesId)
    })
})
}

async function affichCatWorks(categoriesId) {
  gallery.innerHTML = ""
  filtresPos.innerHTML = ""
  afficherCategories()
  const data = localStorage.getItem("works")
  const worksArray = JSON.parse(data)
      worksArray.forEach(item => {
          if (item.category.id == categoriesId) {
              const fig = document.createElement("figure")
              const img = document.createElement("img")
              img.src = item.imageUrl
              img.alt = item.title
              const titre = document.createElement("figcaption")
              titre.textContent = item.title
              gallery.appendChild(fig)
              fig.appendChild(img)
              fig.appendChild(titre)
              let boutFilt = document.getElementById(`${categoriesId}`)
              boutFilt.classList.add("boutonFiltreClic")
          } 
      })
}

// Récupération des éléments HTML
const openModalBtn = document.getElementById("openModal")
const modal = document.getElementById("myModal")
const closeBtn = document.querySelector(".close")

// Fonction pour ouvrir la modale
openModalBtn.addEventListener("click", function() {
  modal.style.display = "flex"
  const data = localStorage.getItem("works")
  const worksArray = JSON.parse(data)
  worksArray.forEach(item => {
      const galerie = document.getElementById("galeriePhotos")
      const card = document.createElement("div")
      const img = document.createElement("img")
      const trash = document.createElement("div")
      const icon = document.createElement("i")
      const title = item.title
      const image = item.imageUrl
      img.src = image
      img.alt = title
      icon.classList.add("fa-solid")
      card.classList.add("photoCard")
      icon.classList.add("fa-trash-can")
      trash.classList.add("photoCard_supp")
      img.classList.add("photoCard_img")
      galerie.appendChild(card)
      card.appendChild(img)
      card.appendChild(trash)
      trash.appendChild(icon)
      trash.addEventListener("click", function() {
        // Supprimer l'élément visuellement de la galerie
        galerie.removeChild(card)
        // Supprimer l'élément correspondant de l'API
        // Vous devez implémenter cette fonction en fonction de votre structure API
        supprimerElementAPI(item.id)
      })
  })
  // Définir les dimensions des éléments et de la marge
  const elementHeight = 105
  const marginBetweenLines = 20
  const elementsPerLine = 5
  // Calculer le nombre de lignes nécessaire pour afficher tous les éléments
  const numLines = Math.ceil(worksArray.length / elementsPerLine)
  // Calculer la hauteur totale de la modal
  const contentHeight = numLines * (elementHeight + marginBetweenLines) - marginBetweenLines
  // Appliquer la hauteur calculée à la modal
  const modalContent = document.querySelector('#galeriePhotos')
  modalContent.style.height = `${contentHeight}px`
})

// Fonction pour fermer la modale
closeBtn.addEventListener("click", async function() {
  const galerie = document.getElementById("galeriePhotos")
  galerie.innerHTML = ""
  modal.style.display = "none"
  let b = document.querySelector(".boutonFiltreClic")
  b.classList.remove("boutonFiltreClic")
  recupWorks()
  affichAllWorks()
})

// Fermer la modale en cliquant en dehors de celle-ci
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    const galerie = document.getElementById("galeriePhotos")
    galerie.innerHTML = ""
    modal.style.display = "none"
    let b = document.querySelector(".boutonFiltreClic")
    b.classList.remove("boutonFiltreClic")
    recupWorks()
    affichAllWorks()
  }
})

function supprimerElementAPI(id) {
  const url = `http://localhost:5678/api/works/${id}`
  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression de l'élément avec l'ID ${id}`)
      }
      console.log(`Élément avec l'ID ${id} supprimé avec succès`)
    })
    .catch(error => {
      console.error('Erreur de suppression:', error.message)
    })
}

