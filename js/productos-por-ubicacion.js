/*En este archivo se crea la funcionalidad para poder visualizar los productos segun la ubicacion especificada
es muy similar a la funcionalidad para consultar por lote*/

const productos = JSON.parse(localStorage.getItem("productos")) || []
let productsContainer = document.getElementById("productos-por-ubicacion")
let aviso = document.getElementById("mensaje")

function renderProductos(productsArray) {
    productsContainer.innerHTML = ""
   
    if (productsArray.length === 0) {
        productsContainer.innerHTML = `<p>No se encontraron productos en esta ubicación.</p>`
        return
    }
    
    productsArray.forEach((producto) => {
        const card = document.createElement("div")
        card.innerHTML = `
            <h3>${producto.codigo}</h3>
            <p>${producto.descripcion} // Lote: ${producto.lote} // Cantidad: ${producto.cantidad}</p>
        `
        productsContainer.appendChild(card)
    })
}

const verUbicacion = () => {
    aviso.innerHTML = ""
   const busquedaUsuario = document.getElementById("posicion").value.toUpperCase()

   if (!busquedaUsuario) {
        aviso.innerHTML = `<p>Por favor, ingresa una ubicación válida.</p>`
        productsContainer.innerHTML = ""
        return
    }

    const ubicaciones = productos.filter((producto) => producto.ubicacion === busquedaUsuario)
    renderProductos(ubicaciones)
}

document.getElementById("botonBuscar").onclick = () => {
    verUbicacion()
}

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html"// Redirige al archivo menu.html
}