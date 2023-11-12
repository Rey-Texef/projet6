const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"
const gallery = document.querySelector(".gallery")
const filtresPos = document.querySelector(".filtres")

async function pageActuelle () {
  const currentPageURL = window.location.href
  if (currentPageURL.includes("index")) {
    const gallery = document.querySelector(".gallery")
    const filtresPos = document.querySelector(".filtres")
    const boutonTous = document.getElementById("tous")
    boutonTous.classList.add("boutonFiltreClic")
    boutonTous.classList.remove("boutonFiltre")
    recupWorks()
    recupCategories()
    affichAllWorks()
    afficherCategories()
    const token = localStorage.getItem('authToken')
    if (token) {
      const logBouton = document.querySelector(".loginBouton")
      logBouton.textContent = "logout"
      logBouton.addEventListener("click", function() {
        localStorage.removeItem("authToken")
      })
    }
    else {
      console.log('Aucun token trouvé dans le localStorage')
    }
  }  
  else {
    boutonLog = document.getElementById("boutonLog")
    boutonLog.addEventListener("click", function(event) {
        event.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const data = {
            email: email,
            password: password
        }
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
              if (data.token) {
                const token = data.token
                try {
                  localStorage.setItem("authToken", token)
                  console.log("Token stocké avec succès : ", localStorage.getItem("authToken"))
                  console.log(localStorage.getItem("authToken"))
                } catch (e) {
                  console.error("Erreur de stockage : ", e)
                }
                window.location.href = "index.html"
              }
              else {
                console.error("Erreur d'authetification")
                let errorAuthent = document.getElementById("errorAuthent")
                errorAuthent.innerHTML = "** Le mot de passe et/ou l'email est(sont) faux **"
              }
          })
          .catch(error => {
              console.error("Une erreur s'est produite : ", error)
          })
    })
}
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


pageActuelle()