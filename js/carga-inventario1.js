/*Swal.fire({
    title: "The Internet?",
    text: "That thing is still around?",
    icon: "warning"
  });*/

  


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
  
  codigoInput.addEventListener("input", () => {
    const codigoIngresado = codigoInput.value.toUpperCase(); 
    const productoEncontrado = buscarProductoPorCodigo(codigoIngresado);
  
    if (productoEncontrado) {
      document.getElementById("descripcion").value = productoEncontrado.descripcion;
      document.getElementById("ubicacion").value = productoEncontrado.ubicacion;
      document.getElementById("descripcion").setAttribute("disabled", "true");
  
      aviso.innerHTML = "";
  
      document.getElementById("cantidad").focus();
    } else {
     
      document.getElementById("descripcion").value = "";
      document.getElementById("ubicacion").value = "";
      document.getElementById("descripcion").removeAttribute("disabled");
  
      aviso.innerHTML = `<p>El código ingresado no se encuentra en la base de datos.</p>`;
    }
  });

let evento = document.getElementById("incluirCarga")
evento.onclick = () => {
    precargarRepuestos()
    Toastify({
        className: "rIngresado",
        avatar: "../icons/ok2.png",
        text: "Repuesto Ingresado!",
        duration: 1000,
       // destination: "https://github.com/apvarun/toastify-js",
       // newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right,rgb(235, 190, 235),rgb(200, 132, 218))",
        },
        offset: {
            x: 200, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 100 // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
}

let evento1 = document.getElementById("botonAgregar")
evento1.onclick = () => {

    Swal.fire({
        title: "¿Querés procesar el ingreso de estos productos?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Procesar",
        denyButtonText: `Cancelar`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Ingreso procesado con exito!", "Agregaste estos productos al stock, podrás visualizarlos en la sección Inventario de Productos.", "success");
          procesarIngreso()
        } else if (result.isDenied) {
          Swal.fire("Ingreso sin procesar!", "Podés editar el ingreso a continuación, si vuelves al menu principal perderás la precarga.", "warning");
        }
      });

    

}

let evento2 = document.getElementById("volverMenu")
evento2.onclick = () => {
    window.location.href = "../index.html" 
}

renderizarPrecarga()
