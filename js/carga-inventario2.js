const productos = JSON.parse(localStorage.getItem("productos")) || []
const preCarga = []
const mensaje = localStorage.getItem("mensaje")
function tostada () { Toastify({
    className: "rIngresado",
    avatar: "../icons/ok2.png",
    text: "Repuesto Ingresado!",
    duration: 1000,
    close: false,
    gravity: "top", // `top` o `bottom`
    position: "right", // `left`, `center` o `right`
    stopOnFocus: false, // Evita que el toast se cierre cuando se pasa el mouse por encima
    style: {
        background: "linear-gradient(to right, rgb(235, 190, 235), rgb(200, 132, 218))",
    },
    offset: {
        x: 200, // Eje horizontal
        y: 100 // Eje vertical
    },
    onClick: function() {} // Callback después de hacer clic
}).showToast();}

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

// Verificación de duplicados con el localStorage
const verificarLoteEnProductos = (lote, codigo) => {
    return productos.some((producto) => producto.lote === lote && producto.codigo !== codigo);
};

const verificarRepuestoDuplicado = (codigo, lote) => {
    // Verificar si ya existe el repuesto en la lista preCarga
    const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === codigo && producto.lote === lote);

    if (repuestoDuplicadoEnPreCarga) {
        // Mostrar alerta con la opción de agregar más cantidad
        Swal.fire({
            icon: "info",
            title: "Repuesto ya ingresado",
            text: `El repuesto con código ${codigo} y lote ${lote} ya está ingresado. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Validar la cantidad ingresada
                const cantidadAAgregar = parseInt(document.getElementById("cantidad").value);

                // Verificar si la cantidad ingresada es válida
                if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) {
                    Swal.fire("Cantidad inválida", "Por favor ingresa una cantidad válida mayor que cero.", "error");
                    return;  // Detener si la cantidad no es válida
                }

                // Si el repuesto ya está en preCarga, agregamos la cantidad al existente
                repuestoDuplicadoEnPreCarga.cantidad += cantidadAAgregar;
             //   tostada()
                // Llamamos a renderizarPrecarga para actualizar la vista
                renderizarPrecarga();

                // Restablecer el formulario y enfocar en el campo de código
                formularioDeProductos.reset();
                document.getElementById("codigo").focus();

                // Mostrar el Toastify después de agregar la cantidad (dentro de la confirmación)
               precargarRepuestos()
                //tostada()
            }
        });

        return true;  // Retornar true si el repuesto ya estaba en preCarga, para evitar continuar
    }

    return false;  // Retornar false si no hay duplicados
}


// Modificación en la función `precargarRepuestos` para integrar la validación de duplicados
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

    // Verificación de que el lote no esté siendo usado con un código diferente en localStorage
    if (verificarLoteEnProductos(cargaLote, cargaCodigo)) {
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado",
            text: `El lote ${cargaLote} ya corresponde a otro repuesto con código diferente en el inventario. Por favor, ingrese un código distinto.`,
            confirmButtonText: "Aceptar"
        });
        return; // Si el lote es duplicado, salir de la función
    }

    // Verificar si el repuesto ya está en localStorage con el mismo código y lote
    const repuestoExistenteEnLocalStorage = productos.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote);

    if (repuestoExistenteEnLocalStorage) {
        // Si existe el repuesto en localStorage, mostramos una alerta para agregar más cantidad
        Swal.fire({
            icon: "info",
            title: "Repuesto existente!",
            text: `El repuesto con código ${cargaCodigo} y lote ${cargaLote} ya existe en el inventario. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Si confirma agregar más, aumentamos la cantidad en preCarga
                const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote);
                tostada()
                if (repuestoDuplicadoEnPreCarga) {
                    // Si ya está en preCarga, solo agregamos la cantidad
                    repuestoDuplicadoEnPreCarga.cantidad += cargaCantidad;
                } else {
                    // Si no está en preCarga, lo agregamos como un nuevo repuesto
                    const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion);
                    preCarga.push(repuesto);
               }
                renderizarPrecarga();
                formularioDeProductos.reset();
                document.getElementById("codigo").focus();
            }
            
        });
        return; // Salir de la función para evitar agregarlo directamente a preCarga
    }
    // Si no existe el repuesto, lo añadimos a la lista de precarga directamente
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

let baseDeDatos = [];

const cargarBaseDeDatos = async () => {
  try {
    // Realizar la solicitud de manera asíncrona
    const response = await fetch("../db/data.json");
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error al cargar la base de datos, la respuesta no es válida.");
    }
    
    // Convertir la respuesta a JSON
    baseDeDatos = await response.json();
  } catch (error) {
    console.error("Error al cargar la base de datos:", error);
    // Mostrar un mensaje de error al usuario
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: "Hubo un problema al cargar los datos. Por favor, inténtalo más tarde.",
    });
  }
};

// Llamamos a la función para cargar los datos
cargarBaseDeDatos();

  
const buscarProductoPorCodigo = (codigo) => {
    return baseDeDatos.find((producto) => producto.codigo === codigo);
};
  
const codigoInput = document.getElementById("codigo");

codigoInput.addEventListener("blur", () => {
    const codigoIngresado = codigoInput.value.toUpperCase();
    const productoEncontrado = buscarProductoPorCodigo(codigoIngresado);

    if (productoEncontrado) {
        // Si el código se encuentra en la base de datos, autocompletar los campos
        document.getElementById("descripcion").value = productoEncontrado.descripcion;
        document.getElementById("ubicacion").value = productoEncontrado.ubicacion;
        document.getElementById("descripcion").setAttribute("disabled", "true");
        document.getElementById("cantidad").focus(); // Pone el foco en el campo de cantidad
    } else if (codigoIngresado !== "") {
        // Si el código no se encuentra en la base de datos y no está vacío
        Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "El código ingresado no se encuentra en la base de datos",
            showConfirmButton: false,
            timer: 1500
        });
        
        // Limpiar los campos de descripción y ubicación si el código no se encuentra
        document.getElementById("descripcion").value = "";
        document.getElementById("ubicacion").value = "";
        document.getElementById("descripcion").removeAttribute("disabled");
    }
});


let evento = document.getElementById("incluirCarga");
evento.onclick = () => {
    let cargaCodigo = document.getElementById("codigo").value.toUpperCase();
    let cargaDescripcion = document.getElementById("descripcion").value.toUpperCase();
    let cargaCantidad = parseInt(document.getElementById("cantidad").value);
    let cargaLote = document.getElementById("lote").value.toUpperCase();
    let cargaUbicacion = document.getElementById("ubicacion").value.toUpperCase();

    // Verificar si algún campo está vacío o la cantidad no es válida
    if (!cargaCodigo || !cargaDescripcion || !cargaLote || !cargaUbicacion || isNaN(cargaCantidad) || cargaCantidad <= 0) {
        Swal.fire("Antes de incluir repuestos, debes llenar todos los campos!");
        return; // Si algún campo está vacío, no se ejecuta el toast
    } else {
        // Verificamos si el lote ya está duplicado en preCarga o localStorage
        const loteDuplicado = verificarLoteDuplicado(cargaLote, cargaCodigo);
        
        if (loteDuplicado) {
            return; // Si el lote está duplicado, ya se disparó el Swal y detenemos la ejecución
        }

        // Verificamos si el repuesto ya existe en la precarga
        const cargaRepuestoDuplicado = verificarRepuestoDuplicado(cargaCodigo, cargaLote);
        
        if (cargaRepuestoDuplicado) {
            // Si el repuesto ya está en preCarga, mostramos el Swal y esperamos la confirmación
            Swal.fire({
                icon: "info",
                title: "Repuesto ya ingresado",
                text: `El repuesto con código ${cargaCodigo} y lote ${cargaLote} ya está ingresado. ¿Deseas agregar más cantidad?`,
                showCancelButton: true,
                confirmButtonText: "Sí, agregar más",
                cancelButtonText: "No, cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Validamos la cantidad
                    const cantidadAAgregar = parseInt(document.getElementById("cantidad").value);

                    // Verificamos si la cantidad ingresada es válida
                    if (isNaN(cantidadAAgregar) || cantidadAAgregar <= 0) {
                        Swal.fire("Cantidad inválida", "Por favor ingresa una cantidad válida mayor que cero.", "error");
                        return;  // Detener si la cantidad no es válida
                    }

                    // Encontramos el repuesto duplicado y sumamos la cantidad
                    const repuestoDuplicadoEnPreCarga = preCarga.find((producto) => producto.codigo === cargaCodigo && producto.lote === cargaLote);
                    if (repuestoDuplicadoEnPreCarga) {
                        repuestoDuplicadoEnPreCarga.cantidad += cantidadAAgregar;
                    }

                    // Llamamos a renderizarPrecarga para actualizar la vista
                    renderizarPrecarga();

                    // Restablecer el formulario y enfocar en el campo de código
                    formularioDeProductos.reset();
                    document.getElementById("codigo").focus();

                    // Mostrar el Toastify solo si confirmamos la acción
                    if(result.isConfirmed){ tostada() }
                }
            });

            return; // Detener la ejecución aquí para esperar la confirmación
        }

        // Mostrar el Toastify solo después de la precarga si no hay duplicados
        precargarRepuestos()
    }
};

// Función que verifica si hay otro repuesto con el mismo lote en preCarga o en el localStorage
const verificarLoteDuplicado = (lote, codigo) => {
    // Verificamos en preCarga
    const loteEnPreCarga = preCarga.find((producto) => producto.lote === lote && producto.codigo !== codigo);
    if (loteEnPreCarga) {
        // Lote duplicado en la precarga
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado en la precarga",
            text: `El lote ${lote} ya corresponde a otro repuesto en la precarga con el código ${loteEnPreCarga.codigo}. Por favor, ingresá un lote distinto.`,
            confirmButtonText: "Aceptar"
        });
        return true; // Si se encuentra en preCarga, se retorna true para detener la ejecución
    }

    // Verificamos en localStorage
    const loteEnLocalStorage = productos.find((producto) => producto.lote === lote && producto.codigo !== codigo);
    if (loteEnLocalStorage) {
        // Lote duplicado en el localStorage
        Swal.fire({
            icon: "warning",
            title: "Lote duplicado en el Inventario",
            text: `El lote ${lote} corresponde a otro repuesto ingresado en el Inventario con el código ${loteEnLocalStorage.codigo}. Por favor, ingresa un lote distinto.`,
            confirmButtonText: "Aceptar"
        });
        return true; // Si se encuentra en localStorage, se retorna true para detener la ejecución
    }

    // Si no se encuentra duplicado
    return false;
};

// Modificación en la función verificarRepuestoDuplicado para realizar la validación con Swal

let evento1 = document.getElementById("botonAgregar")

evento1.onclick = () => {
    // Verificar si hay productos en la precarga
    if (preCarga.length === 0) {
        // Si no hay productos, mostrar un mensaje de advertencia
        Swal.fire({
            title: "No puedes procesar un ingreso vacío!",
            showDenyButton: false,
            showCancelButton: false,
            confirmButtonText: "Aceptar",
            denyButtonText: `Don't save`
        }).then(() => {
            // Después de que el Swal se cierre, mostrar otro mensaje
            Swal.fire("Ingresa repuestos!", "Recuerda que antes de procesar un ingreso debes tener repuestos incluidos en la precarga.", "warning")
                .then(() => {
                    // Establecer el foco en el campo "codigo"
                    document.getElementById("codigo").focus();
                });
        });

        return; // Salir de la función para evitar que se ejecute el siguiente Swal.fire
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
                    procesarIngreso();
                    // Establecer el foco en el campo "codigo" después de que el segundo Swal se cierre
                    document.getElementById("codigo").focus();
                });
        } else if (result.isDenied) {
            Swal.fire("Ingreso sin procesar!", "Podés editar el ingreso a continuación, si vuelves al menu principal perderás la precarga.", "warning")
                .then(() => {
                    // Establecer el foco en el campo "codigo" después de que el segundo Swal se cierre
                    document.getElementById("codigo").focus();
                });
        }
    });
};

let evento2 = document.getElementById("volverMenu")
evento2.onclick = () => {
    window.location.href = "../index.html" 
}

renderizarPrecarga();

