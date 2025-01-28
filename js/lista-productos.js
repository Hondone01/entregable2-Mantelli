let container = document.getElementById("users-container")

fetch("../db/data.json")
   .then(response=> response.json())
   .then(data => {
    data.forEach(product=>{
        const card = document.createElement("div")
        card.innerHTML=`<h2>Codigo: ${product.codigo}</h2>
                        <h3>Descripcion: ${product.descripcion}</h3>
                        <h4>Ubicacion: ${product.ubicacion}</h4>`
        container.appendChild(card)                
    })
   })