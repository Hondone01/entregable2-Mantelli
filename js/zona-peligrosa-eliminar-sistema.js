/*En este archivo se crea la funcionalidad para borrar todos los datos del localStorage con el metodo localstorage
.clear se hace creando un evento onclick para el voton "eliminar datos". Lo primero que hace es borrar el array
productos, luego guarda un mensaje en el localStorage que habia quedado vacio para ser mostrado en el archivo
carga-inventario-inicial.html al cual redirige automaticamente al usuario sugiriendo empezar nuevamente con la
carga de productos*/

let destruirTodoElInventario = document.getElementById("eliminarDatos")

destruirTodoElInventario.onclick = () => {
    // Mostrar mensaje con Swal.fire
    Swal.fire({
        icon: "warning",  // Puedes cambiar el icono según lo que desees
        title: "Reseteaste el Sistema de Stock!!!",
        text: "Se ha borrado todo el inventario, comienza la carga de repuestos.",
        timer: 7000, // El tiempo de duración del mensaje en milisegundos
        timerProgressBar: false, // Para mostrar la barra de progreso
        didOpen: () => {
            Swal.showLoading(); // Muestra el loader mientras el mensaje está activo
        },
        willClose: () => {
            // Limpiar el localStorage y redirigir a la página de carga de inventario
            localStorage.clear(); // Limpiar el almacenamiento local
            window.location.href = "../html/carga-inventario-inicial.html"; // Redirigir a otra página
        }
    });
}


let evento1 = document.getElementById("volverMenu")
evento1.onclick = () => {
    window.location.href = "../index.html" 
}