const productos = JSON.parse(localStorage.getItem("productos")) || []
const preCarga = []
const mensaje = localStorage.getItem("mensaje")
function tostada () { Toastify({
    className: "rIngresado",
    avatar: "../icons/ok2.png",
    text: "Repuesto Ingresado!",
    duration: 1000,
    close: false,
    gravity: "top", 
    position: "right", 
    stopOnFocus: false, 
    style: {
        background: "linear-gradient(to right, rgb(235, 190, 235), rgb(200, 132, 218))",
    },
    offset: {
        x: 200, 
        y: 100 
    },
    onClick: function() {} 
}).showToast();
document.getElementById("codigo").focus()}

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
        card.classList.add("cardProducto");
        card.innerHTML = `
           <div>${producto.codigo}</div>   
           <div>${producto.lote}</div>
           <div>${producto.cantidad}</div>            
           <button class="eliminar" data-index="${index}">Eliminar</button>
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

const verificarLoteEnProductos = (lote, codigo) => {
    return productos.some((producto) => producto.lote === lote && producto.codigo !== codigo);
};

const verificarRepuestoDuplicado = (codigo, lote) => {
    // Verifica si ya existe el repuesto en la lista preCarga
    const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === codigo && producto.lote === lote);

    if (repuestoDuplicadoEnPreCarga) {
        Swal.fire({
            icon: "info",
            title: "Repuesto ya ingresado",
            text: `El repuesto con código ${codigo} y lote ${lote} ya está ingresado. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const cantidadAAgregar = parseInt(document.getElementById("cantidad").value);
                if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) {
                    Swal.fire("Cantidad inválida", "Por favor ingresa una cantidad válida mayor que cero.", "error");
                    return;  
                }
                repuestoDuplicadoEnPreCarga.cantidad += cantidadAAgregar
                renderizarPrecarga()
                formularioDeProductos.reset()
                document.getElementById("codigo").focus()
               precargarRepuestos()
            }
        })
        return true 
    }
    return false 
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
    if (verificarLoteEnProductos(cargaLote, cargaCodigo)) {
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado",
            text: `El lote ${cargaLote} ya corresponde a otro repuesto con código diferente en el inventario. Por favor, ingrese un código distinto.`,
            confirmButtonText: "Aceptar"
        })
        return
    }

    // Verifica si el repuesto ya está en localStorage con el mismo código y lote
    const repuestoExistenteEnLocalStorage = productos.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote);

    if (repuestoExistenteEnLocalStorage) {
        Swal.fire({
            icon: "info",
            title: "Repuesto existente!",
            text: `El repuesto con código ${cargaCodigo} y lote ${cargaLote} ya existe en el inventario. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote)
                tostada()
                if (repuestoDuplicadoEnPreCarga) {
                    repuestoDuplicadoEnPreCarga.cantidad += cargaCantidad
                } else {
                    const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion)
                    preCarga.push(repuesto)
               }
                renderizarPrecarga()
                formularioDeProductos.reset()
                document.getElementById("codigo").focus()
            }
        })
        return; 
    }
    const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion);
    preCarga.push(repuesto);
    tostada()
    renderizarPrecarga();
    formularioDeProductos.reset();
    document.getElementById("codigo").focus();
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

    preCarga.length = 0 
    renderizarPrecarga() 
    aviso.innerHTML = `<p>Productos procesados correctamente.</p>`
}

let baseDeDatos = []

const cargarBaseDeDatos = async () => {
  try {
    const response = await fetch("../db/data.json")
    if (!response.ok) {
      throw new Error("Error al cargar la base de datos, la respuesta no es válida.")
    }
    baseDeDatos = await response.json()
  } catch (error) {
    console.error("Error al cargar la base de datos:", error)
  
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "Hubo un problema al cargar los datos. Por favor, inténtalo más tarde.",
    })
  }
}

cargarBaseDeDatos()
const buscarProductoPorCodigo = (codigo) => {
    return baseDeDatos.find((producto) => producto.codigo === codigo)
}
  
const codigoInput = document.getElementById("codigo")

codigoInput.addEventListener("blur", () => {
    const codigoIngresado = codigoInput.value.toUpperCase()
    const productoEncontrado = buscarProductoPorCodigo(codigoIngresado)

    if (productoEncontrado) {
        
        document.getElementById("descripcion").value = productoEncontrado.descripcion
        document.getElementById("ubicacion").value = productoEncontrado.ubicacion
        document.getElementById("descripcion").setAttribute("disabled", "true")
        document.getElementById("cantidad").focus()
    } else if (codigoIngresado !== "") {
        
        Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "El código ingresado no se encuentra en la base de datos",
            showConfirmButton: false,
            timer: 1500
        });
        
        document.getElementById("descripcion").value = ""
        document.getElementById("ubicacion").value = ""
        document.getElementById("descripcion").removeAttribute("disabled")
    }
})

let evento = document.getElementById("incluirCarga")
evento.onclick = () => {
    let cargaCodigo = document.getElementById("codigo").value.toUpperCase()
    let cargaDescripcion = document.getElementById("descripcion").value.toUpperCase()
    let cargaCantidad = parseInt(document.getElementById("cantidad").value)
    let cargaLote = document.getElementById("lote").value.toUpperCase()
    let cargaUbicacion = document.getElementById("ubicacion").value.toUpperCase()

    
    if (!cargaCodigo || !cargaDescripcion || !cargaLote || !cargaUbicacion || isNaN(cargaCantidad) || cargaCantidad <= 0) {
        Swal.fire("Antes de incluir repuestos, debes llenar todos los campos!")
        return
    } else {
        
        const loteDuplicado = verificarLoteDuplicado(cargaLote, cargaCodigo)
        
        if (loteDuplicado) {
            return
        }

        const cargaRepuestoDuplicado = verificarRepuestoDuplicado(cargaCodigo, cargaLote)
        
        if (cargaRepuestoDuplicado) {
          
            Swal.fire({
                icon: "info",
                title: "Repuesto ya ingresado",
                text: `El repuesto con código ${cargaCodigo} y lote ${cargaLote} ya está ingresado. ¿Deseas agregar más cantidad?`,
                showCancelButton: true,
                confirmButtonText: "Sí, agregar más",
                cancelButtonText: "No, cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                   
                    const cantidadAAgregar = parseInt(document.getElementById("cantidad").value)

                    if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) {
                        Swal.fire("Cantidad inválida", "Por favor ingresa una cantidad válida mayor que cero.", "error")
                        return
                    }

                    const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote)
                    if (repuestoDuplicadoEnPreCarga) {
                        repuestoDuplicadoEnPreCarga.cantidad += cantidadAAgregar
                    }

                    renderizarPrecarga()

                    formularioDeProductos.reset()
                    document.getElementById("codigo").focus()

                    if(result.isConfirmed){ tostada() }
                }
            })
            return
        }
        precargarRepuestos()
    }
}
// Función que verifica si hay otro repuesto con el mismo lote en preCarga o en el localStorage
const verificarLoteDuplicado = (lote, codigo) => {
    const loteEnPreCarga = preCarga.find((producto) => producto.lote === lote && producto.codigo !== codigo)
    if (loteEnPreCarga) {
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado en la precarga",
            text: `El lote ${lote} ya corresponde a otro repuesto en la precarga con el código ${loteEnPreCarga.codigo}. Por favor, ingresá un lote distinto.`,
            confirmButtonText: "Aceptar"
        })
        return true
    }

    const loteEnLocalStorage = productos.find((producto) => producto.lote === lote && producto.codigo !== codigo)
    if (loteEnLocalStorage) {
        
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado en el Inventario",
            text: `El lote ${lote} corresponde a otro repuesto ingresado en el Inventario con el código ${loteEnLocalStorage.codigo}. Por favor, ingresa un lote distinto.`,
            confirmButtonText: "Aceptar"
        })
        return true
    }

    return false;
}

let evento1 = document.getElementById("botonAgregar")

evento1.onclick = () => {
   
    if (preCarga.length === 0) {
        
        Swal.fire({
            title: "No puedes procesar un ingreso vacío!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Aceptar",
            denyButtonText: `Don't save`
        }).then(() => {
            
            Swal.fire("Ingresa repuestos!", "Recuerda que antes de procesar un ingreso debes tener repuestos incluidos en la precarga.", "warning")
                .then(() => {
                   
                    document.getElementById("codigo").focus()
                })
        })

        return
    }

    // Si hay productos en la precarga, continuar con la confirmación para procesar
    Swal.fire({
        title: "¿Querés procesar el ingreso de estos productos?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Procesar",
        denyButtonText: `Cancelar`
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Ingreso procesado con exito!", "Agregaste estos productos al stock, podrás visualizarlos en la sección Inventario de Productos.", "success")
                .then(() => {
                    procesarIngreso()
                    document.getElementById("codigo").focus()
                })
        } else if (result.isDenied) {
            Swal.fire("Ingreso sin procesar!", "Podés editar el ingreso a continuación, si vuelves al menu principal perderás la precarga.", "warning")
                .then(() => {
                    document.getElementById("codigo").focus()
                })
        }
    })
}

let evento2 = document.getElementById("volverMenu")
evento2.onclick = () => {
    window.location.href = "../index.html" 
}

renderizarPrecarga()

