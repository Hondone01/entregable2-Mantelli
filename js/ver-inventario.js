/*En este archivo se crea la funcionalidad para poder consultar el inventario de productos de manera actualizada
se obtienen los datos almacenados en localStorage pero antes de mostrarlos se utiliza el método sort para ordenar
los elementos del array por su propiedad codigo de menor a mayor y los agrupa por lotes distintos y ubicaciones
distintas mostrando el total de cada grupo*/
const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("products-container")

function renderProductos(productsArray) {
    productsArray.sort((a, b) => a.codigo.localeCompare(b.codigo))
    productsArray.forEach((producto) => {
        const card = document.createElement("div")
        card.innerHTML = `
                         <h3>${producto.codigo}</h3>
                         <p>Descripcion: ${producto.descripcion} || Lote: ${producto.lote} || Cantidad: ${producto.cantidad} || Ubicacion: ${producto.ubicacion}</p>
                         `
        productsContainer.appendChild(card)
    })
}
renderProductos(productos)   

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" // Redirige al archivo menu.html
}
