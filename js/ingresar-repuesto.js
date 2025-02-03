/*En este archivo se crea la funcionalidad para hacer el ingreso de uno o varios repuestos, esta pensado para
una instancia posterior cuando la carga inicial de inventario ya fue realizada. comparte una estructura similar
a la funcionalidad de "consumir-repuesto" pero en este caso primero chequea si el repuesto con codigo y lote
que el usuario esta ingresando ya existe anteriormente, si es así suma la cantidad q ingresa el usuario y lo 
almacena en el localStorage y sinó crea el objeto completo y tambien lo almacena en el array del localStorage*/

const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-ingreso-container")
//let productsContainerUno = document.getElementById("productos-ingreso-containerUno")
document.getElementById("codigo").focus()

if (productos.length === 0) {
    Swal.fire("No se encontraron productos ingresados con ese código.");
   // productsContainer.innerHTML = `<p>No se encontraron productos ingresados con ese código.</p>`
}

const ingresoRepuesto = () => {
    productsContainer.innerHTML = ""
   // productsContainerUno.innerHTML = ""

    let ingresoCodigo = document.getElementById("codigo").value.toUpperCase()
    let ingresoLote = document.getElementById("lote").value.toUpperCase()
    let cantidadAgregar = Number(document.getElementById("cantidad").value)
    let descripcion = document.getElementById("detalle").value.toUpperCase()
    let ubicacion = document.getElementById("posicion").value.toUpperCase()

    if (!ingresoCodigo || !ingresoLote || cantidadAgregar <= 0) {
        Swal.fire("Debes completar todos los datos y la cantidad debe ser mayor a 0.");
       // aviso.innerHTML = "<p>Debes completar todos los datos y la cantidad debe ser mayor a 0.</p>"
        return
    }

    const repuestoExistente = productos.find(
        (producto) => producto.codigo === ingresoCodigo && producto.lote === ingresoLote
    )

    if (repuestoExistente) {
        repuestoExistente.cantidad += cantidadAgregar
        localStorage.setItem("productos", JSON.stringify(productos)) 

      //  const card1 = document.createElement("div")
      //  card1.innerHTML = `
       //     <p>Se agregaron ${cantidadAgregar} unidad/es al repuesto con código ${ingresoCodigo} con lote ${ingresoLote}.</p>
      //      <p>Cantidad total en stock: ${repuestoExistente.cantidad}.</p>
      //  `
      //  productsContainerUno.appendChild(card1)


      //  aviso.innerHTML = `
      //      <p>Se agregaron ${cantidadAgregar} unidad/es al repuesto con código ${ingresoCodigo} con lote ${ingresoLote}.</p>
      //      <p>Cantidad total en stock: ${repuestoExistente.cantidad}.</p>
      //  `

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
            <p>Cantidad total en stock: ${repuestoExistente.cantidad}.</p>
            <p>*************************************************************</p>
        `
        productsContainer.appendChild(card)
        
    } else {
        if (!descripcion || !ubicacion) {
            Swal.fire("Falta completar la descripción y/o la ubicación para agregar un nuevo repuesto.");
           // aviso.innerHTML = "<p>Debes completar la descripción y la ubicación para agregar un nuevo repuesto.</p>"
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
    document.getElementById("codigo").value = ""
    document.getElementById("lote").value = ""
    document.getElementById("cantidad").value = ""
    document.getElementById("detalle").value = ""
    document.getElementById("posicion").value = ""
    document.getElementById("codigo").focus()

}

let evento = document.getElementById("botonCalcular")
evento.onclick = () => {
    ingresoRepuesto()
    document.getElementById("codigo").focus()
}

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}
