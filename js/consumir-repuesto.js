/*En este archivo la funcionalidad lograda es primero recuperar los datos almacenados en localStorage para
luego poder realizar el consumo del repuesto previamente almacenado. En el caso de que en el localStorage no 
se haya guardado informacion con el array productos se crea uno vacio. 
Mediante uso del DOM se obtienen los datos del html que el usuario indica dentro de los inputs y luego de
modificar el array productos y almacenar la cantidad actualizada en localStorage se muestra un mensaje
de resultado mediante la creación de una "card" que se inyecta en el html dentro del section con id "productos-
consumo-container*/

const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-consumo-container")
document.getElementById("codigo").focus()

if (productos.length === 0) {
    Swal.fire("No se encontraron productos ingresados con ese código.");
} 

const consumoRepuesto = () => {
    productsContainer.innerHTML = ""

    let consumoCodigo = document.getElementById("codigo").value.toUpperCase()
    let consumoLote = document.getElementById("lote").value.toUpperCase()
    let consumoUbicacion = document.getElementById("ubicacion").value.toUpperCase()  // Obtener la ubicación
    let cantidadConsumir = Number(document.getElementById("cantidad").value) 
    
    // Ahora filtramos por código, lote y ubicación
    const repuestosFiltrados = productos.filter((producto) => 
        producto.codigo === consumoCodigo && 
        producto.lote === consumoLote && 
        producto.ubicacion === consumoUbicacion // Filtrar por ubicación
    )

    if (repuestosFiltrados.length === 0) {
        Swal.fire("No hay existencias del repuesto con el código, lote y ubicación que estás buscando");
    } else {
        const cantidadTotalDisponible = repuestosFiltrados.reduce((total, producto) => total + producto.cantidad, 0)

        if (cantidadConsumir <= 0) {
            Swal.fire("La cantidad que querés consumir no puede ser igual o menor que 0.");
        } else if (cantidadConsumir > cantidadTotalDisponible) {
            Swal.fire("No hay suficiente cantidad en stock para realizar el consumo por el total que indicaste.");
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
                <p>Ubicación: ${consumoUbicacion}.</p> <!-- Mostrar ubicación -->
                <p>Cantidad total restante del lote consumido: ${cantidadRestanteTotal}.</p>
                <p>*************************************************************</p>
            `
            productsContainer.appendChild(card)
            Swal.fire("Consumo realizado!")
        }
    }
    // Limpiar campos después de la operación
    document.getElementById("codigo").value = ""
    document.getElementById("lote").value = ""
    document.getElementById("cantidad").value = ""
    document.getElementById("ubicacion").value = ""  // Limpiar campo de ubicación
    document.getElementById("codigo").focus()
}

let calculo = document.getElementById("calcular");
calculo.onclick = () => {
    if (document.getElementById("codigo").value === "" || 
        document.getElementById("lote").value === "" || 
        document.getElementById("cantidad").value === "" || 
        document.getElementById("ubicacion").value === "") {  // Verificar que todos los campos estén completos
        Swal.fire("Debes completar todos los campos!");
    } else {
        consumoRepuesto();
    }
};

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}
