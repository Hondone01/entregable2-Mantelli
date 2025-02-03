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

// Función que verifica si el repuesto (código y lote) ya existe en localStorage
const verificarRepuestoDuplicado = (codigo, lote) => {
    // Verificar si ya existe el repuesto en la lista preCarga
    const repuestoDuplicadoEnPreCarga = preCarga.some((producto) => producto.codigo === codigo && producto.lote === lote);
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
                // Si confirma agregar más, aumentamos la cantidad
                const repuestoExistente = preCarga.find((producto) => producto.codigo === codigo && producto.lote === lote);
                repuestoExistente.cantidad += parseInt(document.getElementById("cantidad").value);  // Aumentamos la cantidad
                renderizarPrecarga();  // Re-renderizamos la vista

                // Llamamos a las funciones para restablecer el formulario sin interferir con Swal
                formularioDeProductos.reset();  // Limpiamos el formulario
                document.getElementById("codigo").focus();  // Focamos en el campo código
            }
        });
        return true; // Retornar true si ya existe en preCarga
    }

    // Verificar si ya existe el repuesto en los productos almacenados en localStorage
    const repuestoExistenteEnLocalStorage = productos.find((producto) => producto.codigo === codigo && producto.lote === lote);
    if (repuestoExistenteEnLocalStorage) {
        Swal.fire({
            icon: "info",
            title: "Repuesto ya ingresado",
            text: `El repuesto con código ${codigo} y lote ${lote} ya está en el inventario. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Si confirma agregar más, aumentamos la cantidad del producto en localStorage
                repuestoExistenteEnLocalStorage.cantidad += parseInt(document.getElementById("cantidad").value);
                localStorage.setItem("productos", JSON.stringify(productos));  // Actualizamos en localStorage
                renderizarPrecarga();  // Re-renderizamos la vista

                // Llamamos a las funciones para restablecer el formulario sin interferir con Swal
                formularioDeProductos.reset();  // Limpiamos el formulario
                document.getElementById("codigo").focus();  // Focamos en el campo código
            }
        });
        return true; // Retornar true si ya existe en localStorage
    }

    return false; // Retornar false si no hay duplicados
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

    // Verificar si el repuesto ya está en localStorage o en la preCarga antes de agregarlo
    if (verificarRepuestoDuplicado(cargaCodigo, cargaLote)) {
        return; // Si es duplicado, salir de la función
    }

    // Si no existe el repuesto, lo añadimos a la lista de precarga
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

    preCarga.length = 0 
    renderizarPrecarga() 
    aviso.innerHTML = `<p>Productos procesados correctamente.</p>`
}

let baseDeDatos =[];
fetch("../db/data.json")
  .then((response) => response.json())
  .then((data) => {
    baseDeDatos = data; 
  });
  
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

let evento = document.getElementById("incluirCarga")
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
        // Si los campos son válidos, precargar el repuesto y mostrar el toast
        precargarRepuestos();
        Toastify({
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
        }).showToast();
    }
};

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

