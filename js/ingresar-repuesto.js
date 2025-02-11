const productos = JSON.parse(localStorage.getItem("productos")) || []

let productsContainer = document.getElementById("productos-ingreso-container")
document.getElementById("codigo").focus()

let baseDeDatos = []

fetch("../db/data.json")
  .then((response) => {
    try {
      if (!response.ok) {
        throw new Error("Error al cargar la base de datos, la respuesta no es válida.")
      }
      return response.json()
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: `Hubo un problema: ${err.message}. Por favor, inténtalo más tarde.`,
      })
    }
  })
  .then((data) => {
    try {
      baseDeDatos = data
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al procesar los datos",
        text: `Hubo un error al procesar los datos: ${err.message}`,
      })
    }
  })
  .catch((err) => {
    Swal.fire({
      icon: "error",
      title: "Error de conexión",
      text: `Hubo un problema: ${err.message}. Por favor, inténtalo más tarde.`,
    })
  })

const buscarProductoPorCodigo = (codigo) => {
  return baseDeDatos.find((producto) => producto.codigo === codigo)
}

if (productos.length === 0) {
  Swal.fire("No se encontraron productos ingresados con ese código.")
}

// Modificación para permitir repuestos con el mismo código y lote en diferentes ubicaciones
const verificarRepuestoEnLocalStorage = (lote, codigo, ubicacion) => {
  // Verifica si ya existe el mismo código y lote en una ubicación diferente
  const repuestoExistente = productos.find(
    (producto) => producto.lote === lote && producto.codigo === codigo && producto.ubicacion === ubicacion
  )
  if (repuestoExistente) {
    Swal.fire({
      icon: "warning",
      title: "Lote duplicado en la misma ubicación",
      text: `El repuesto con código ${codigo} y lote ${lote} ya existe en la ubicación ${ubicacion}. Por favor, ingresa una ubicación diferente.`,
      confirmButtonText: "Aceptar",
    })
    return true
  }
  return false
}

const ingresoRepuesto = () => {
  productsContainer.innerHTML = ""

  let ingresoCodigo = document.getElementById("codigo").value.toUpperCase()
  let ingresoLote = document.getElementById("lote").value.toUpperCase()
  let cantidadAgregar = Number(document.getElementById("cantidad").value)
  let descripcion = document.getElementById("detalle").value.toUpperCase()
  let ubicacion = document.getElementById("posicion").value.toUpperCase()

  if (!ingresoCodigo || !ingresoLote || cantidadAgregar <= 0) {
    Swal.fire("Debes completar todos los datos y la cantidad debe ser mayor a 0.")
    return
  }

  if (verificarRepuestoEnLocalStorage(ingresoLote, ingresoCodigo, ubicacion)) {
    return
  }

  const repuestoExistenteEnLocalStorage = productos.find(
    (producto) => producto.codigo === ingresoCodigo && producto.lote === ingresoLote && producto.ubicacion === ubicacion
  )

  if (repuestoExistenteEnLocalStorage) {
    Swal.fire({
      icon: "info",
      title: "Repuesto existente!",
      text: `El repuesto con código ${ingresoCodigo} y lote ${ingresoLote} ya existe en el inventario en la ubicación ${ubicacion}. ¿Deseas agregar más cantidad?`,
      showCancelButton: true,
      confirmButtonText: "Sí, agregar más",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        repuestoExistenteEnLocalStorage.cantidad += cantidadAgregar
        localStorage.setItem("productos", JSON.stringify(productos))

        const card = document.createElement("div")
        card.innerHTML = `
          <p>*************************************************************</p>
          <h3>Ingreso efectuado del código: ${ingresoCodigo}!</h3>
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
    })
  } else {
    if (!descripcion || !ubicacion) {
      Swal.fire("Falta completar la descripción y/o la ubicación para agregar un nuevo repuesto.")
      return
    }

    const nuevoRepuesto = {
      codigo: ingresoCodigo,
      descripcion: descripcion,
      cantidad: cantidadAgregar,
      lote: ingresoLote,
      ubicacion: ubicacion,
    }
    productos.push(nuevoRepuesto)
    localStorage.setItem("productos", JSON.stringify(productos))

    // Calcular la cantidad total en stock, sumando todas las cantidades en las ubicaciones
    const cantidadTotal = productos
      .filter((producto) => producto.codigo === ingresoCodigo && producto.lote === ingresoLote)
      .reduce((total, producto) => total + producto.cantidad, 0)

    const card = document.createElement("div")
    card.innerHTML = `
      <p>*************************************************************</p>
      <h3>Nuevo repuesto ingresado con código: ${ingresoCodigo}!</h3>
      <p>-----------------------------------------------------------------------</p>
      <p>Cantidad agregada: ${cantidadAgregar} unidades</p>
      <p>Descripción: ${descripcion}</p>
      <p>Lote: ${ingresoLote}</p>
      <p>Ubicación: ${ubicacion}</p>
      <p>-----------------------------------------------------------------------</p>
      <p>Cantidad total en stock: ${cantidadTotal}.</p> <!-- Aquí mostramos la cantidad total en stock -->
      <p>*************************************************************</p>
    `
    productsContainer.appendChild(card)
  }
  document.getElementById("codigo").value = ""
  document.getElementById("lote").value = ""
  document.getElementById("cantidad").value = ""
  document.getElementById("detalle").value = ""
  document.getElementById("posicion").value = ""
  document.getElementById("codigo").focus()
}


const codigoInput = document.getElementById("codigo")
codigoInput.addEventListener("blur", () => {
  const codigoIngresado = codigoInput.value.toUpperCase()
  const productoEncontrado = buscarProductoPorCodigo(codigoIngresado)

  if (productoEncontrado) {
    document.getElementById("detalle").value = productoEncontrado.descripcion
    document.getElementById("posicion").value = productoEncontrado.ubicacion
    document.getElementById("detalle").setAttribute("disabled", "true")
    document.getElementById("cantidad").focus()
  } else if (codigoIngresado !== "") {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "El código ingresado no se encuentra en la base de datos",
      showConfirmButton: false,
      timer: 1500,
    })
    document.getElementById("detalle").value = ""
    document.getElementById("posicion").value = ""
    document.getElementById("detalle").removeAttribute("disabled")
  }
})

let evento = document.getElementById("botonCalcular")
evento.onclick = () => {
  ingresoRepuesto()
  document.getElementById("codigo").focus()
}

document.getElementById("cantidad").addEventListener("blur", () => {
  document.getElementById("lote").focus()
})

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
  window.location.href = "../index.html"
}


