/*En este archivo se crea la funcionalidad para borrar todos los datos del localStorage con el metodo localstorage
.clear se hace creando un evento onclick para el voton "eliminar datos". Lo primero que hace es borrar el array
productos, luego guarda un mensaje en el localStorage que habia quedado vacio para ser mostrado en el archivo
carga-inventario-inicial.html al cual redirige automaticamente al usuario sugiriendo empezar nuevamente con la
carga de productos*/

let destruirTodoElInventario = document.getElementById("eliminarDatos")

destruirTodoElInventario.onclick = () => {
   
    Swal.fire({
        icon: "warning",  
        title: "Reseteaste el Sistema de Stock!!!",
        text: "Se ha borrado todo el inventario, comienza la carga de repuestos.",
        timer: 7000, 
        timerProgressBar: false, 
        didOpen: () => {
            Swal.showLoading()
        },
        willClose: () => {
            localStorage.clear()
            window.location.href = "../html/carga-inventario-inicial.html"
        }
    })
}

let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}