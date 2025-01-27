const productos = JSON.parse(localStorage.getItem("productos")) || []
const preCarga = []

const mensaje = localStorage.getItem("mensaje")
document.getElementById("codigo").focus()
if (mensaje) {
    const mensajeDiv = document.getElementById("mensajeCarga")
    mensajeDiv.innerHTML = `<p class="mensajeAlerta">${mensaje}</p>`
    localStorage.removeItem("mensaje")
}

class Repuestos {
    static id = 0

    constructor(codigo, descripcion, cantidad, lote, ubicacion) {
        this.id = ++Repuestos.id
        this.codigo = codigo
        this.descripcion = descripcion
        this.cantidad = cantidad
        this.lote = lote
        this.ubicacion = ubicacion
    }
}

const formularioDeProductos = document.getElementById("form-carga")
const aviso = document.getElementById("mensajeCarga")
const productoCargadoDiv = document.getElementById("productoCargado")

const renderizarPrecarga = () => {
    productoCargadoDiv.innerHTML = ""

    preCarga.forEach((producto, index) => {
        const card = document.createElement("div")
        card.innerHTML = `
           <pre>  ${producto.codigo}                  ${producto.lote}          ${producto.cantidad}  <button class="eliminar" data-index="${index}">Eliminar</button></pre>
        `
        productoCargadoDiv.appendChild(card)
    })

    const botonesEliminar = document.querySelectorAll(".eliminar")
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const index = e.target.dataset.index
            preCarga.splice(index, 1)
            renderizarPrecarga()
            document.getElementById("codigo").focus()
        })
    })
}

const precargarRepuestos = () => {
    aviso.innerHTML = ""
    let cargaCodigo = document.getElementById("codigo").value.toUpperCase()
    let cargaDescripcion = document.getElementById("descripcion").value.toUpperCase()
    let cargaCantidad = parseInt(document.getElementById("cantidad").value)
    let cargaLote = document.getElementById("lote").value.toUpperCase()
    let cargaUbicacion = document.getElementById("ubicacion").value.toUpperCase()

    if (isNaN(cargaCantidad) || cargaCantidad <= 0) {
        aviso.innerHTML = `<p>Falta ingresar valores, la cantidad es menor que 0 o ingresaste un valor inválido.</p>`
        return
    }

    const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion)
    preCarga.push(repuesto)

    renderizarPrecarga()
    formularioDeProductos.reset()
    document.getElementById("codigo").focus()
}

const procesarIngreso = () => {
    if (preCarga.length === 0) {
        aviso.innerHTML = `<p>No hay productos en precarga para procesar.</p>`
        return
    }
   
    preCarga.forEach((producto) => {
        const repuestoExistente = productos.find((p) => 
            p.codigo === producto.codigo && 
            p.lote === producto.lote &&
            p.ubicacion === producto.ubicacion
        )

        if (repuestoExistente) {
            repuestoExistente.cantidad += producto.cantidad
        } else {
            productos.push(producto)
        }
    })

    localStorage.setItem("productos", JSON.stringify(productos))

    preCarga.length = 0 // Vaciar la precarga
    renderizarPrecarga() // Limpiar la vista de precarga
   // document.getElementById("codigo").focus()
    aviso.innerHTML = `<p>Productos procesados correctamente.</p>`
}

let evento = document.getElementById("incluirCarga")
evento.onclick = () => {
    precargarRepuestos()
}

let evento1 = document.getElementById("botonAgregar")
evento1.onclick = () => {
    procesarIngreso()
}

let evento2 = document.getElementById("volverMenu")
evento2.onclick = () => {
    window.location.href = "../index.html" 
}

renderizarPrecarga()
