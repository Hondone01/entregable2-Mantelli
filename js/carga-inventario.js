/*En este archivo la intención fué generar la funcionalidad para que el usuario mediante el uso de una clase
constructora pueda ir creando e ingresando productos al inventario. Los objetos creados se pushean en el array
"productos" que luego se guardan en localStorage para poder llamar el array y reutilizar los objetos en el 
contenido.*/

const mensaje = localStorage.getItem("mensaje")
if (mensaje) {
    const mensajeDiv = document.getElementById("mensajeCarga")
    mensajeDiv.innerHTML = `<p class="mensajeAlerta">${mensaje}</p>`
    localStorage.removeItem("mensaje")
}

class Repuestos {
    static id = 0;

    constructor(codigo, descripcion, cantidad, lote, ubicacion) {
        this.id = ++Repuestos.id
        this.codigo = codigo
        this.descripcion = descripcion
        this.cantidad = cantidad
        this.lote = lote
        this.ubicacion = ubicacion
    }
}

const productos = JSON.parse(localStorage.getItem("productos")) || []
const formularioDeProductos = document.getElementById("form-carga")
let aviso = document.getElementById("mensajeCarga")
const cargaDeRepuestos = () => {
    aviso.innerHTML = ""
    let cargaCodigo = document.getElementById("codigo").value.toUpperCase()
    let cargaDescripcion = document.getElementById("descripcion").value.toUpperCase()
    let cargaCantidad = document.getElementById("cantidad").value
    let cargaLote = document.getElementById("lote").value.toUpperCase()
    let cargaUbicacion = document.getElementById("ubicacion").value.toUpperCase()

    if (isNaN(cargaCantidad) || cargaCantidad <= 0) {
        aviso.innerHTML = `<p>Falta ingresar valores, la cantidad es menor que 0 o ingresaste un valor invalido.</p>`
        return
    }

    const repuestoExistente = productos.find((producto) => 
        producto.codigo === cargaCodigo && 
        producto.lote === cargaLote &&
        producto.ubicacion === cargaUbicacion
    )

    if (repuestoExistente) {
        repuestoExistente.cantidad += cargaCantidad
    } else {
        const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion)
        productos.push(repuesto)
    }

    localStorage.setItem("productos", JSON.stringify(productos))
}

let evento = document.getElementById("botonAgregar")
evento.onclick = () => {
    cargaDeRepuestos()
    productos.forEach((producto) => {
    })
    formularioDeProductos.reset()
}

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html";
}
