fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    afficherImages(data)
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error)
  });

function afficherImages(data) {
    const gallery = document.querySelector(".gallery")
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
    });
}