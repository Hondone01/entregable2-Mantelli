// Seleccionar el contenedor donde se mostrarán los productos cargados
const productoCargadoDiv = document.getElementById("productoCargado");

// Función para renderizar los productos en el div
const renderizarProductos = () => {
    // Limpiar el contenido actual del contenedor
    productoCargadoDiv.innerHTML = "";

    // Iterar sobre el array de productos y crear una "card" para cada uno
    productos.forEach((producto) => {
        const card = document.createElement("div"); // Crear un contenedor para cada producto
        card.innerHTML = `
            <p>*************************************************************</p>
            <h3>Producto cargado: ${producto.codigo}</h3>
            <p>Descripción: ${producto.descripcion}</p>
            <p>Cantidad: ${producto.cantidad} unidad/es</p>
            <p>Lote: ${producto.lote}</p>
            <p>Ubicación: ${producto.ubicacion}</p>
            <p>*************************************************************</p>
        `;
        // Agregar estilos opcionales a la card (opcional)
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.marginBottom = "10px";
        card.style.backgroundColor = "#f9f9f9";

        // Agregar la card al contenedor
        productoCargadoDiv.appendChild(card);
    });
};

// Modificar la función de carga para incluir el renderizado
const cargaDeRepuestos = () => {
    aviso.innerHTML = "";
    let cargaCodigo = document.getElementById("codigo").value.toUpperCase();
    let cargaDescripcion = document.getElementById("descripcion").value.toUpperCase();
    let cargaCantidad = parseInt(document.getElementById("cantidad").value);
    let cargaLote = document.getElementById("lote").value.toUpperCase();
    let cargaUbicacion = document.getElementById("ubicacion").value.toUpperCase();

    if (isNaN(cargaCantidad) || cargaCantidad <= 0) {
        aviso.innerHTML = `<p>Falta ingresar valores, la cantidad es menor que 0 o ingresaste un valor inválido.</p>`;
        return;
    }

    const repuestoExistente = productos.find((producto) => 
        producto.codigo === cargaCodigo && 
        producto.lote === cargaLote &&
        producto.ubicacion === cargaUbicacion
    );

    if (repuestoExistente) {
        repuestoExistente.cantidad += cargaCantidad;
    } else {
        const repuesto = new Repuestos(cargaCodigo, cargaDescripcion, cargaCantidad, cargaLote, cargaUbicacion);
        productos.push(repuesto);
    }

    localStorage.setItem("productos", JSON.stringify(productos));

    // Renderizar los productos después de cada carga
    renderizarProductos();
};

// Modificar el evento del botón para incluir el renderizado
evento.onclick = () => {
    cargaDeRepuestos();
    formularioDeProductos.reset();
};

// Renderizar los productos cargados al inicio (en caso de que haya datos guardados)
renderizarProductos();
