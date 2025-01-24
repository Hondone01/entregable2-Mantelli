/*En este archivo se crea una funcionalidad unicamente de consulta que no altera el contenido del array productos
en el localStorage. Utiliza el metodo filter para crear un nuevo array con el lote buscado y el metodo reduce, por
si hay mas de un objeto con el mismo codigo de producto en el array, para poder sumarlo y entregar el
resultado de manera correcta. Luego con un forEach recorre el array y entrega los objetos del mismo en el html
usando la estructura de las cards*/

const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-lote-container")
let aviso = document.getElementById("mensaje")

if (productos.length === 0) {
    productsContainer.innerHTML = `<p>No se encontraron productos con ese lote.</p>`
}

const loteBusqueda = () => {
    aviso.innerHTML = ""
    productsContainer.innerHTML = ""

    let busquedaLote = document.getElementById("lote").value.toUpperCase()

    if (!busquedaLote) {
        aviso.innerHTML = `<p>Por favor, ingresá un lote válido.</p>`
        return
    }

    const buscarLote = productos.filter((producto) => producto.lote === busquedaLote)

    if (buscarLote.length === 0) {
        productsContainer.innerHTML = `<p>No se encontraron repuestos con el lote ingresado.</p>`
        document.getElementById("lote").value = ""
        return
    }

    let cantidadTotalLote = buscarLote.reduce(
        (total, producto) => total + Number(producto.cantidad), 0)

    const card = document.createElement("div")
    card.innerHTML = `
        <p>***********************</p>
        <h3>Lote: ${busquedaLote}</h3>
        <p>***********************</p>
    `
    productsContainer.appendChild(card)
    
    buscarLote.forEach((producto) => {
        const productCard = document.createElement("div")
        productCard.innerHTML = `
            <h4>Código: ${producto.codigo}</h4>
            <p>Descripción: ${producto.descripcion}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>---------------------------</p>
        `
        productsContainer.appendChild(productCard)
    })
    document.getElementById("lote").value = ""
}

let evento = document.getElementById("botonCalcular")
evento.onclick = () => {
    loteBusqueda()
}

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}