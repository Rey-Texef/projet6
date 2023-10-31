const worksUrl = "http://localhost:5678/api/works"
const categoriesUrl = "http://localhost:5678/api/categories"

const gallery = document.querySelector(".gallery")
const filtresPos = document.querySelector(".filtres")

affichAllWorks()
afficherCategories()
const boutonTous = document.getElementById("tous")
boutonTous.classList.add("boutonFiltreClic")
boutonTous.classList.remove("boutonFiltre")

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


  
