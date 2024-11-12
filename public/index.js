const tableBody = document.getElementById("table-body");
const formNuevaTarea = document.getElementById("formNuevaTarea");

// Cargar tareas desde la API
async function cargarTareas() {
    try {
        let response = await fetch('/api/tareas');
        let data = await response.json();
        tableBody.innerHTML = "";

        data.forEach(tarea => {
            const tr = document.createElement('tr');



            // Titulo
            const tdTitulo = document.createElement('td');
            tdTitulo.textContent = tarea.titulo;
            tdTitulo.className ="ps-3 fw-bold"
            tdTitulo.contentEditable = true;
            tdTitulo.addEventListener('blur', () => actualizarTarea(tarea._id, 'titulo', tdTitulo.textContent));

            // Descripción
            const tdDescripcion = document.createElement('td');
            tdDescripcion.className ="ps-3"
            tdDescripcion.textContent = tarea.descripcion;
            tdDescripcion.contentEditable = true;
            tdDescripcion.addEventListener('blur', () => actualizarTarea(tarea._id, 'descripcion', tdDescripcion.textContent));

            // Fecha de finalización
            const tdFechaFin = document.createElement('td');
            tdFechaFin.className ="ps-3"
            tdFechaFin.textContent = new Date(tarea.fechaFin).toLocaleDateString();
            tdFechaFin.addEventListener('blur', () => actualizarTarea(tarea._id, 'fechaFin', new Date(tdFechaFin.textContent)));

            // Completada (Checkbox)
            const tdCompletada = document.createElement('td');
            tdCompletada.className ="ps-3"
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = tarea.completada;
            checkbox.addEventListener('change', () => actualizarTarea(tarea._id, 'completada', checkbox.checked));
            tdCompletada.appendChild(checkbox);



            // Fecha de creación (no editable)
            const tdFechaCreacion = document.createElement('td');
            tdFechaCreacion.className ="ps-3"
            tdFechaCreacion.textContent = new Date(tarea.fechaCreacion).toLocaleDateString();

            // Boton eliminar tarea
            const tdBtnEliminar = document.createElement('td');
            const btnEliminar = document.createElement('button')
            const iconoEliminar = document.createElement('i'); // Crear el icono de la papelera
            iconoEliminar.classList.add('bi', 'bi-trash');  // Usamos la clase 'bi-trash' para el icono de papelera
            btnEliminar.appendChild(iconoEliminar)
            btnEliminar.addEventListener('click', () => eliminarTarea(tarea._id))
            tdBtnEliminar.appendChild(btnEliminar)
            tdBtnEliminar.className = "ps-3"


            // Añadir celdas a la fila
            tr.appendChild(tdTitulo);
            tr.appendChild(tdDescripcion);
            tr.appendChild(tdFechaFin);
            tr.appendChild(tdCompletada);
            tr.appendChild(tdFechaCreacion);
            tr.appendChild(tdBtnEliminar);
            tr.classList = tarea.completada ? "opacity-50" : "opacity-100"
            // Añadir la fila a la tabla
            tr.style.backgroundColor = seleccionarColor(tarea.titulo);
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.log("Error al cargar las tareas:", error);
    }
}


// Agregar nueva tarea
formNuevaTarea.addEventListener('submit', async function(event) {
    event.preventDefault();

    const inputTitulo = document.getElementById('inputTitulo').value;
    const inputDescripcion = document.getElementById('inputDescripcion').value;
    const inputFechaFin = document.getElementById('inputFechaFin').value;
    const inputCompletada = document.getElementById('inputCompletada').checked;

    if (!inputTitulo || !inputDescripcion || !inputFechaFin) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: inputTitulo,
                descripcion: inputDescripcion,
                fechaFin: inputFechaFin,
                completada: inputCompletada
            })
        });

        if (response.ok) {
            cargarTareas();
            formNuevaTarea.reset();
        } else {
            alert('Error al agregar tarea');
        }
    } catch (error) {
        console.log("Error al agregar tarea:", error);
    }
});

// Actualizar una tarea
async function actualizarTarea(id, campo, valor) {
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [campo]: valor }) // Envia solo el campo y el valor actualizados
        })

        if (!response.ok) {
            throw new Error("No se pudo actualizar la tarea");
        }
        // Llamamos a cargarTareas() para actualizar la tabla con los datos más recientes
        cargarTareas()
    } catch (error) {
        console.log("Error al actualizar la tarea:", error);
        alert("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
    }
    
}

async function eliminarTarea(id){
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error("No se pudo actualizar la tarea");
        }


    } catch (error) {
        console.log("Error al actualizar la tarea:", {message: message.error});
        alert("Error al eliminar la tarea, Por favor, inténtalo de nuevo.");
    }
    cargarTareas()

}

// Función para seleccionar el color de fondo según el título de la tarea
function seleccionarColor(titulo) {
    let color = "";
    switch (titulo.toLowerCase()) {
        case "interfaces":
        case "german":
            color = "rgba(167, 92, 192, 0.10)";
            break;
        case "empresa":
        case "empresas":    
        case "rocio":
            color = "rgba(167, 92, 35, 0.10)";
            break;
        case "acceso a datos":
        case "acceso datos":
        case "acceso":
        case "datos":
            color = "rgba(0, 40, 145, 0.10)";
            break;
        case "lucia":
        case "marcas":
        case "html":
        case "gestion de empresas":
        case "erp":
            color = "rgba(255, 0, 0, 0.10)";
            break;
        case "procesos":
        case "moncho":
        case "process":
        case "hilos":
            color = "rgba(0, 255, 255, 0.10)";
            break;
        default:
            color = "#ffffff"; // Color predeterminado
            break;
    }
    return color;
}
// Cargar las tareas al recargar la pagina
document.addEventListener('DOMContentLoaded', cargarTareas);
