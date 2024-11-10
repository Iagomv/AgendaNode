const mongoose = require('mongoose') //Importamos BBDD

// Objeto tarea
const tareaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    },
    completada: {
        type: Boolean,
        required: true,
    },
    fechaCreacion:{
        type: Date,
        default: Date.now
    }
})

module.exports= mongoose.model("tarea", tareaSchema)