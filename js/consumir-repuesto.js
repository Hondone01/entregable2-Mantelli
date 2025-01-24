/*En este archivo la funcionalidad lograda es primero recuperar los datos almacenados en localStorage para
luego poder realizar el consumo del repuesto previamente almacenado. En el caso de que en el localStorage no 
se haya guardado informacion con el array productos se crea uno vacio. 
Mediante uso del DOM se obtienen los datos del html que el usuario indica dentro de los inputs y luego de
modificar el array productos y almacenar la cantidad actualizada en localStorage se muestra un mensaje
de resultado mediante la creación de una "card" que se inyecta en el html dentro del section con id "productos-
consumo-container*/

const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-consumo-container")
let aviso = document.getElementById("mensaje")

if (productos.length === 0) {
    productsContainer.innerHTML = `<p>No se encontraron productos ingresados con ese código.</p>`
} 

const consumoRepuesto = () => {
    aviso.innerHTML = ""
    productsContainer.innerHTML = ""

    let consumoCodigo = document.getElementById("codigo").value.toUpperCase()
    let consumoLote = document.getElementById("lote").value.toUpperCase()
    let cantidadConsumir = Number(document.getElementById("cantidad").value) 
    
    const repuestosFiltrados = productos.filter((producto) => producto.codigo === consumoCodigo && producto.lote === consumoLote)

    if (repuestosFiltrados.length === 0) {
        aviso.innerHTML = `<p>No se encontró el repuesto con el código y el lote que estás buscando</p>`
    } else {
        const cantidadTotalDisponible = repuestosFiltrados.reduce((total, producto) => total + producto.cantidad, 0)

        if (cantidadConsumir <= 0) {
            aviso.innerHTML = "<p>La cantidad que querés consumir no puede ser igual o menor que 0.</p>"
        } else if (cantidadConsumir > cantidadTotalDisponible) {
            aviso.innerHTML = "<p>No hay suficiente cantidad en stock para realizar el consumo por el total de unidades que indicaste.</p>"
        } else {
           
            let cantidadRestanteConsumir = cantidadConsumir
            repuestosFiltrados.forEach((producto) => {
                if (cantidadRestanteConsumir > 0) {
                    if (producto.cantidad >= cantidadRestanteConsumir) {
                        producto.cantidad -= cantidadRestanteConsumir
                        cantidadRestanteConsumir = 0
                    } else {
                        cantidadRestanteConsumir -= producto.cantidad
                        producto.cantidad = 0
                    }
                }
            })

            localStorage.setItem("productos", JSON.stringify(productos))

            const cantidadRestanteTotal = cantidadTotalDisponible - cantidadConsumir
            const card = document.createElement("div")
            card.innerHTML = `
                <p>*************************************************************</p>
                <h3>Consumo efectuado del código: ${consumoCodigo} !</h3>
                <p>-----------------------------------------------------------------------</p>
                <p>Consumiste: ${cantidadConsumir} unidad/es</p>
                <p>Con el lote: ${consumoLote}.</p>
                <p>Cantidad total restante del lote consumido: ${cantidadRestanteTotal}.</p>
                <p>*************************************************************</p>
            `
            productsContainer.appendChild(card)
        }
    }
    document.getElementById("codigo").value = ""
    document.getElementById("lote").value = ""
    document.getElementById("cantidad").value = ""
}

let calculo = document.getElementById("calcular")
calculo.onclick = () => {
    consumoRepuesto()
}

let evento1 = document.getElementById("vuelvoMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}