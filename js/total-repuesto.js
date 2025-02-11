/*En este archivo se crea la funcionalidad para que el usuario pueda saber la cantidad total de un repuesto segun,
su propiedad codigo, recoge los datos ingresados por el usuario y los devuelve al html indicando las ubica-
ciones distintas, si las hay, haciendose valer para ello del metodo new set() que evita que los elementos se dupli-
quen de esta manera no repite la misma ubicacion cuando entrega el resultado.*/

const productos = JSON.parse(localStorage.getItem("productos")) || []
let productsContainer = document.getElementById("productos-total-container")
let aviso = document.getElementById("mensaje")
document.getElementById("producto").focus()
if (productos.length === 0) {
    Swal.fire("No se encontraron productos con el código introducido.")
}

const cantidadTotal = () => {
    aviso.innerHTML = ""
    productsContainer.innerHTML = ""
    let repuestoBuscado = document.getElementById("producto").value.toUpperCase()

    if (!repuestoBuscado) {
        Swal.fire("Por favor, ingresá un código de repuesto válido.")
        return
    }

    const busquedaRepuestos = productos.filter((producto) => producto.codigo === repuestoBuscado)

    if (busquedaRepuestos.length === 0) {
        Swal.fire("No se encontraron productos con el código introducido.")
        return
    } else {
        let cantidadTotal = 0
        let descripcionProducto = "" 
        let ubicaciones = new Set() 

        busquedaRepuestos.forEach((producto) => {
            cantidadTotal += parseInt(producto.cantidad)
            descripcionProducto = producto.descripcion 
            ubicaciones.add(producto.ubicacion)
        })

        const ubicacionesLista = Array.from(ubicaciones).join(" || ")

        const card = document.createElement("div")
        card.innerHTML = `
            <h2>DATOS OBTENIDOS:</h2>
            <h3>Código: ${repuestoBuscado}</h3>
            <p>Descripción: ${descripcionProducto}</p>
            <p>Ubicacion/es: ${ubicacionesLista}</p>
            <p>Cantidad Total: ${cantidadTotal}</p>
        `
        productsContainer.appendChild(card)

    }
    document.getElementById("producto").value=""
}

let evento = document.getElementById("botonCalcular")
evento.onclick = () => {
    cantidadTotal()
    document.getElementById("producto").focus()
}

let volverAlMenu = document.getElementById("volverMenu")
volverAlMenu.onclick = () => {
    window.location.href = "../index.html"
}

   
