const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"
const loginUrl = "http://localhost:5678/api/users/login"

const gallery = document.querySelector(".gallery")
const filtresPos = document.querySelector(".filtres")

var currentPathname = window.location.pathname
if (currentPathname.includes("index.html")) {
    affichAllWorks()
    afficherCategories()
    const boutonTous = document.getElementById("tous")
    boutonTous.classList.add("boutonFiltreClic")
    boutonTous.classList.remove("boutonFiltre")
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
                localStorage.setItem('authToken', token)
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


async function affichAllWorks() {
    try {
        let reponse = await fetch(worksUrl)
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
        }
        let data = await reponse.json()
        data.forEach(item => {
            const fig = document.createElement("figure")
            const img = document.createElement("img")
            img.src = item.imageUrl
            img.alt = item.title
            const titre = document.createElement("figcaption")
            titre.textContent = item.title
            gallery.appendChild(fig)
            fig.appendChild(img)
            fig.appendChild(titre)
            let boutFilt = document.getElementById("tous")
            boutFilt.classList.add("boutonFiltreClic")
        });
    } catch (erreur) {
        console.error("Une erreur s'est produite : ", erreur);
    }
}

async function afficherCategories() {
    const boutFilt = document.createElement("button")
    boutFilt.classList.add("boutonFiltre")
    boutFilt.id = "tous"
    boutFilt.textContent = "Tous"
    filtresPos.appendChild(boutFilt)

    document.getElementById("tous").addEventListener("click", function () {
        gallery.innerHTML = ""
        filtresPos.innerHTML = ""
        afficherCategories()
        affichAllWorks()
    })
    try {
        let reponse = await fetch(categoriesUrl)
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
        }
        let data = await reponse.json()

        data.forEach(item => {
            const boutFilt = document.createElement("button")
            boutFilt.classList.add("boutonFiltre")
            boutFilt.id = item.id
            boutFilt.textContent = item.name
            filtresPos.appendChild(boutFilt)

            boutFilt.addEventListener("click", function(event) {
                const categoriesId = event.currentTarget.id
                affichCatWorks(categoriesId)
            })
        });
    } catch (erreur) {
        console.error("Une erreur s'est produite : ", erreur)
    }
}


async function affichCatWorks(categoriesId) {
    gallery.innerHTML = ""
    filtresPos.innerHTML = ""
    afficherCategories()
    try {
        let reponse = await fetch(worksUrl);
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`)
        }
        let data = await reponse.json()
        data.forEach(item => {
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
        });
    } catch (erreur) {
        console.error("Une erreur s'est produite : ", erreur);
    }
}

