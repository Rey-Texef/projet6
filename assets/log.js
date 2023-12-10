boutonProjets =document.getElementById("boutonProjets")
boutonProjets.addEventListener("click", function () {
  window.location.href = "index.html"
})
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