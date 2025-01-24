/*En este script se crea una función que almacena una ventana emergente modal, el procedimiento es muy similar
a la estructura de la card explicada en la ultima clase, cada parte de la ventana que se crea mediante uso de
DOM se le indica un id y una class lo que permite estilar mediante css.
  La funcion creada es llamada con el evento destruirInventario.onclick dentro del boton con id borrarTodoEl
Inventario lo cual hace que aparezca la advertencia automaticamente cuando se presiona dicho botón*/

function crearVentanaEmergente() {
    const modalContainer = document.createElement("div")
    modalContainer.id = "modal_container"
    modalContainer.className = "modal-container"
    document.body.appendChild(modalContainer)

    const modal = document.createElement("div")
    modal.className = "modal"
    modalContainer.appendChild(modal)

    const modalTitle = document.createElement("h1")
    modalTitle.textContent = "ATENCIÓN!!!"
    modal.appendChild(modalTitle)

    const modalText = document.createElement("p")
    modalText.textContent = "Estas a punto de borrar todos los datos del Sistema de Stock! ¿Estas seguro que deseas continuar?"
    modal.appendChild(modalText)

    const closeButton = document.createElement("button")
    closeButton.id = "close"
    closeButton.textContent = "Cerrar"
    modal.appendChild(closeButton)

    modalContainer.classList.add("show")

    // En este evento que se asigna al boton cerrar dentro de la ventana elimina la clase show dentro del css
    // que le da la opacidad para que se visualice, esto hace que la ventana no se vea mas.
    // y con modalContainer.remove() realmente se elimina la ventana del DOM
    closeButton.onclick = () => {
        modalContainer.classList.remove("show")
        modalContainer.remove() 
        window.location.href = "../html/zona-peligrosa-eliminar-sistema.html" 
    }
}

let destruirInventario = document.getElementById("borrarTodoElInventario")
destruirInventario.onclick = () => {
    crearVentanaEmergente()
}

let volverAlmenu = document.getElementById("vuelvoMenu")
volverAlmenu.onclick = () => {
     window.location.href = "../index.html"
}
