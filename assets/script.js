fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(imgProj => {
    afficherImages(imgProj)
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error)
  });

function afficherImages(imgProj) {
    const gallery = document.querySelector(".gallery")
    imgProj.forEach(item => {
        const fig = document.createElement("figure")
        const img = document.createElement("img")
        img.src = item.imageUrl
        img.alt = item.title
        const titre = document.createElement("figcaption")
        titre.textContent = item.title
        gallery.appendChild(fig)
        fig.appendChild(img)
        fig.appendChild(titre)
    });
}

fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(filtres => {
    creerFiltres(filtres)
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error)
  });

function creerFiltres(filtres) {
  const filtresPos = document.querySelector(".filtres")
  filtres.forEach(item => {
    const boutFilt = document.createElement("button")
    boutFilt.classList.add("boutonFiltre")
    boutFilt.id = item.name
    boutFilt.textContent = item.name
    filtresPos.appendChild(boutFilt)
  })
}

const boutonTous = document.getElementById("tous")
boutonTous.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = ""
  afficherImages(imgProj)
})
