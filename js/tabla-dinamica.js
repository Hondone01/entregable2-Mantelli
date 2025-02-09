
const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("products-container")

function renderProductos(productsArray) {
    productsArray.forEach((producto) => {
        const card = document.createElement("div")
        card.innerHTML = `
                         <h3>${producto.codigo}</h3>
                         <p>Descripcion: ${producto.descripcion} Lote: ${producto.lote} Cantidad: ${producto.cantidad} Ubicacion: ${producto.ubicacion}</p>
                         `
        productsContainer.appendChild(card)
    })
}
renderProductos(productos)   

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html"
}
