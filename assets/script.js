const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"
const gallery = document.querySelector(".gallery")
const filtresPos = document.querySelector(".filtres")
const boutonTous = document.getElementById("tous")

boutonTous.classList.add("boutonFiltreClic")
boutonTous.classList.remove("boutonFiltre")

// Récupération des éléments HTML
const openModalBtn = document.getElementById("openModal")
const returnModalBtn = document.querySelector(".retour")
const modal = document.getElementById("myModal")
const modal2 = document.getElementById("addModal")
const closeBtn = document.querySelector(".close")
const closeBtn2 = document.querySelector(".close2")
const addButton = document.querySelector(".addButton")
const addImgBouton = document.getElementById("addImgBouton")
const imgInput = document.getElementById("imgInput")
const addTitre = document.getElementById("addTitre")
const addCategory = document.getElementById("addCategory")
const boutonAjoutImage =document.getElementById("boutonAjoutImage")
const formulaireImg = document.querySelector(".addModal_input")
const previewImage = document.getElementById('previewImage')

recupCategories()
affichNewWorks()
afficherCategories()

// Verification connexion
const token = localStorage.getItem("authToken")
if (token) {
  const logBouton = document.querySelector(".loginBouton")
  const editionMode = document.querySelector(".editionMode")
  editionMode.style.display = "flex"
  logBouton.textContent = "logout"
  logBouton.href = "./index.html"
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

// Met à jour local storage et affiche les projets
async function affichNewWorks() {
  try {
    const data = await recupWorks() // Attendre que recupWorks soit terminé
    gallery.innerHTML = ""
    affichAllWorks()
  } catch (erreur) {
    console.error("Une erreur s'est produite lors de l'affichage des travaux : ", erreur);
  }
}

async function refreshAfterAdd() {
  try {
    const data = await recupWorks() // Attendre que recupWorks soit terminé
    closeModal2()
    ouvrirModale2()
  } catch (erreur) {
    console.error("Une erreur s'est produite lors de l'affichage des travaux : ", erreur);
  }
}

async function refreshAfterSuppr() {
  try {
    const data = await recupWorks() // Attendre que recupWorks soit terminé
    closeModal()
    ouvrirModale1()
  } catch (erreur) {
    console.error("Une erreur s'est produite lors de l'affichage des travaux : ", erreur);
  }
}


// Fonction pour ouvrir la modale
openModalBtn.addEventListener("click", ouvrirModale1)
returnModalBtn.addEventListener("click", retourModale1)
function ouvrirModale1() {
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
        supprimerElementAPI(item.id)
      })
  })
  // Définir les dimensions des éléments et de la marge
  const elementHeight = 105
  const marginBetweenLines = 20
  const elementsPerLine = 5
  // Calculer le nombre de lignes nécessaire pour afficher tous les éléments
  const numLines = Math.ceil(worksArray.length / elementsPerLine)
  // Calculer la hauteur totale de la modale
  const contentHeight = numLines * (elementHeight + marginBetweenLines) - marginBetweenLines
  // Appliquer la hauteur calculée à la modale
  const modalContent = document.querySelector('#galeriePhotos')
  modalContent.style.height = `${contentHeight}px`
  addButton.addEventListener("click", ouvrirModale2)
}


// Fonction pour fermer la modale
closeBtn.addEventListener("click", closeModal)
async function closeModal() {
  const galerie = document.getElementById("galeriePhotos")
  galerie.innerHTML = ""
  modal.style.display = "none"
  let b = document.querySelector(".boutonFiltreClic")
  b.classList.remove("boutonFiltreClic")
  recupWorks()
  affichAllWorks()
}

// Fermer la modale en cliquant en dehors de celle-ci
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    closeModal()
  }
})

// Supprimer un element de l'API
function supprimerElementAPI(id) {
  var confirmation = confirm("Êtes-vous sûr de vouloir effectuer cette action ?")
      if (confirmation) {
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
        alert("Action effectuée !")
        refreshAfterSuppr()
      } else {
        alert("Action annulée.")
      }
}

// Modal 2

function ouvrirModale2() {
  closeModal()
  modal2.style.display = "flex"
  addCategory.innerHTML =""
  const data = localStorage.getItem("categories")
  const catArray = JSON.parse(data)
  let imageAdded = false
  catArray.forEach(item => {
    const select = document.getElementById("addCategory")
    const option = document.createElement("option")
    const nom = item.name
    const valeur = item.id
    option.value = valeur
    option.textContent = nom
    option.classList.add("champCat")
    select.appendChild(option)
  })
  addCategory.selectedIndex = -1
  verifForm()
  boutonAjoutImage.addEventListener('click', sendWork)
}

// Permet de retourner à la modale 1 en cliquant sur la flèche
function retourModale1() {
  closeModal2()
  ouvrirModale1()
}


// Permet d'ouvrir l'input d'images (invisible à l'écran) en cliquant sur le boutton associé
addImgBouton.addEventListener("click", function () {
  imgInput.click()
})

// Permet de lancer des actions lors d'un changement dans l'input images
imgInput.addEventListener("change", function () {
  const selectedImg = imgInput.files[0]
  if (selectedImg && (selectedImg.type === "image/jpeg" || selectedImg.type === "image/png")) {
    // Vérifier la taille du fichier (en octets)
    if (selectedImg.size <= 4 * 1024 * 1024) {
      // La taille et le type sont valides, vous pouvez utiliser l'image
      const cadreImageInput = document.querySelector(".cadreImageInput")
      const imgElement = document.createElement("img")
      imgElement.id = "previewImage"
      imgElement.alt = ""
      addImgBouton.style.visibility = "hidden"
      const addImageUrl = URL.createObjectURL(selectedImg)
      imgElement.src = addImageUrl
      cadreImageInput.appendChild(imgElement)
      verifForm()
    }
    else {
      alert("La taille de l'image doit être inférieure ou égale à 4 Mo.")
      // Réinitialiser l'input file pour éviter de conserver une image invalide
      imgInput.value = ""
    }
  } else {
    alert("Veuillez sélectionner une image au format JPG ou PNG.")
    // Réinitialiser l'input file pour éviter de conserver une image invalide
    imgInput.value = ""
  }
})

function verifForm() {
  const form = document.querySelector(".addModal_input")
  if (form.checkValidity()) {
    boutonAjoutImage.classList.add("addModal_buttonCheck")
    boutonAjoutImage.classList.remove("addModal_button")   
  }
  else {
    if (boutonAjoutImage.classList.contains("addModal_buttonCheck")) {
      boutonAjoutImage.classList.remove("addModal_buttonCheck")
      boutonAjoutImage.classList.add("addModal_button")
    }
  }
}

addTitre.addEventListener("change", function () {
  verifForm()
})

addCategory.addEventListener("change", function () {
  verifForm()
})

// Fonction pour fermer la modale2
closeBtn2.addEventListener("click", closeModal2)
async function closeModal2() {
  addTitre.value = ""
  addCategory.innerHTML = ""
  addImgBouton.style.visibility = "visible"
  const elementASupprimer = document.getElementById("previewImage")
  if (elementASupprimer) {
    elementASupprimer.remove()
  }
  const galerie = document.getElementById("galeriePhotos")
  galerie.innerHTML = ""
  gallery.innerHTML = ""
  modal2.style.display = "none"
  let b = document.querySelector(".boutonFiltreClic")
  b.classList.remove("boutonFiltreClic")
  recupWorks()
  affichAllWorks()
}

// Fermer la modale2 en cliquant en dehors de celle-ci
window.addEventListener("click", function(event) {
  if (event.target === modal2) {
    closeModal2()
  }
})

// fonction pour envoyer un projet
function sendWork(event) {
  if (boutonAjoutImage.classList.contains("addModal_buttonCheck")) {
    event.preventDefault()
    const formData = new FormData()
    if (imgInput.files.length > 0) {
      const file = imgInput.files[0]
      formData.append('image', file)
    }
    formData.append('title', addTitre.value)
    formData.append('category', addCategory.value)
    const token = localStorage.getItem("authToken")
    fetch(worksUrl, {
      method: 'POST',
      body: formData,
      headers: {Authorization: 'Bearer ' + token}
    })
    .then((response) => {
      if (response.ok) {
        alert("Image envoyée avec succès")
        refreshAfterAdd()
      } else {
        console.error("Erreur lors de l'envoi de l'image")
        alert("Erreur lors de l'envoi de l'image")
      }
    })
    .catch((error) => {
      console.error("Erreur d'envoi de données à l'API", error)
    })
  }
  else {
    alert("Veuillez remplir tous les formulaires")
  }
}

