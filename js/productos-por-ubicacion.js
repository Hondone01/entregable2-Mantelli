/*En este archivo se crea la funcionalidad para poder visualizar los productos segun la ubicacion especificada
es muy similar a la funcionalidad para consultar por lote*/

const productos = JSON.parse(localStorage.getItem("productos")) || []
let productsContainer = document.getElementById("productos-por-ubicacion")
let aviso = document.getElementById("mensaje")
document.getElementById("posicion").focus()
function renderProductos(productsArray) {
    productsContainer.innerHTML = ""
    document.getElementById("posicion").focus()
    if (productsArray.length === 0) {
        Swal.fire("No se encontraron repuestos en esta ubicación!");
        document.getElementById("posicion").value=""
        document.getElementById("posicion").focus()
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
     document.getElementById("posicion").value=""
     document.getElementById("posicion").focus()
}

const verUbicacion = () => {
    aviso.innerHTML = ""
   const busquedaUsuario = document.getElementById("posicion").value.toUpperCase()
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