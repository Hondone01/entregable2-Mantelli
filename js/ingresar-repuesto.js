/*En este archivo se crea la funcionalidad para hacer el ingreso de uno o varios repuestos, esta pensado para
una instancia posterior cuando la carga inicial de inventario ya fue realizada. comparte una estructura similar
a la funcionalidad de "consumir-repuesto" pero en este caso primero chequea si el repuesto con codigo y lote
que el usuario esta ingresando ya existe anteriormente, si es así suma la cantidad q ingresa el usuario y lo 
almacena en el localStorage y sinó crea el objeto completo y tambien lo almacena en el array del localStorage*/

const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-ingreso-container")
document.getElementById("codigo").focus()

let baseDeDatos = [];
fetch("../db/data.json")
  .then((response) => response.json())
  .then((data) => {
    baseDeDatos = data;
  });

const buscarProductoPorCodigo = (codigo) => {
    return baseDeDatos.find((producto) => producto.codigo === codigo);
};

if (productos.length === 0) {
    Swal.fire("No se encontraron productos ingresados con ese código.");
}

const ingresoRepuesto = () => {
    productsContainer.innerHTML = ""

    let ingresoCodigo = document.getElementById("codigo").value.toUpperCase()
    let ingresoLote = document.getElementById("lote").value.toUpperCase()
    let cantidadAgregar = Number(document.getElementById("cantidad").value)
    let descripcion = document.getElementById("detalle").value.toUpperCase()
    let ubicacion = document.getElementById("posicion").value.toUpperCase()

    if (!ingresoCodigo || !ingresoLote || cantidadAgregar <= 0) {
        Swal.fire("Debes completar todos los datos y la cantidad debe ser mayor a 0.");
        return
    }

    const repuestoExistenteEnLocalStorage = productos.find(
        (producto) => producto.codigo === ingresoCodigo && producto.lote === ingresoLote
    );

    if (repuestoExistenteEnLocalStorage) {
        // Si existe el repuesto en localStorage, mostramos una alerta para agregar más cantidad
        Swal.fire({
            icon: "info",
            title: "Repuesto existente!",
            text: `El repuesto con código ${ingresoCodigo} y lote ${ingresoLote} ya existe en el inventario. ¿Deseas agregar más cantidad?`,
            showCancelButton: true,
            confirmButtonText: "Sí, agregar más",
            cancelButtonText: "No, cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, se agrega más cantidad
                repuestoExistenteEnLocalStorage.cantidad += cantidadAgregar;
                localStorage.setItem("productos", JSON.stringify(productos))

                const card = document.createElement("div")
                card.innerHTML = `
                    <p>*************************************************************</p>
                    <h3>Ingreso efectuado del código: ${ingresoCodigo} !</h3>
                    <p>-----------------------------------------------------------------------</p>
                    <p>Agregaste: ${cantidadAgregar} unidades</p>
                    <p>Descripción: ${descripcion}</p>
                    <p>Con el lote: ${ingresoLote}.</p>
                    <p>En la ubicación: ${ubicacion}.</p>
                    <p>-----------------------------------------------------------------------</p>
                    <p>Cantidad total en stock: ${repuestoExistenteEnLocalStorage.cantidad}.</p>
                    <p>*************************************************************</p>
                `
                productsContainer.appendChild(card)
            }
        });
    } else {
        // Si no existe el repuesto en el localStorage, agregarlo normalmente
        if (!descripcion || !ubicacion) {
            Swal.fire("Falta completar la descripción y/o la ubicación para agregar un nuevo repuesto.");
            return
        }

        const nuevoRepuesto = {
            codigo: ingresoCodigo,
            descripcion: descripcion,
            cantidad: cantidadAgregar,
            lote: ingresoLote,
            ubicacion: ubicacion
        }
        productos.push(nuevoRepuesto)

        localStorage.setItem("productos", JSON.stringify(productos))
    }

    // Limpiar los campos después del ingreso
    document.getElementById("codigo").value = ""
    document.getElementById("lote").value = ""
    document.getElementById("cantidad").value = ""
    document.getElementById("detalle").value = ""
    document.getElementById("posicion").value = ""
    document.getElementById("codigo").focus()
}

// Evento para calcular ingreso
let evento = document.getElementById("botonCalcular")
evento.onclick = () => {
    ingresoRepuesto()
    document.getElementById("codigo").focus()
}

// Evento para volver al menú
let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}

// Autocompletar la descripción y ubicación al perder el foco del campo código
const codigoInput = document.getElementById("codigo");

codigoInput.addEventListener("blur", () => {
    const codigoIngresado = codigoInput.value.toUpperCase();
    const productoEncontrado = buscarProductoPorCodigo(codigoIngresado);

    if (productoEncontrado) {
        // Si el código se encuentra en la base de datos, autocompletar los campos
        document.getElementById("detalle").value = productoEncontrado.descripcion;
        document.getElementById("posicion").value = productoEncontrado.ubicacion;
        document.getElementById("detalle").setAttribute("disabled", "true"); // Deshabilitar campo de descripción
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
        document.getElementById("detalle").value = "";
        document.getElementById("posicion").value = "";
        document.getElementById("detalle").removeAttribute("disabled"); // Volver a habilitar el campo de descripción
    }
});

