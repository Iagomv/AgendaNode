const express = require('express')
const router = express.Router()
const Tarea = require('../models/tarea')



//Ruta para obtener todos las tareas
router.get('/',async (req,res) => {
    try {
        const tareas =await Tarea.find().sort({ fechaFin: 1 });
        res.json(tareas)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})


// Obtener una tarea
// 1 -> Buscamos la tarea con el Middleware getTarea
router.get('/:id', getTarea, (req,res) => {
    res.json(res.tarea)
})


//Crear una tarea req.body => new Tarea => tarea.save()
router.post('/',async (req,res) =>{
    const tarea = new Tarea({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        fechaFin: req.body.fechaFin|| Date.now(),
        completada: req.body.completada
    })
    try {
        const newTarea = await tarea.save()
        res.status(201).json(newTarea)
    } catch (error) {
        res.status(400).json({ message: error.message }); // Línea corregida
    }
})


// Actualizar una tarea
router.patch('/:id', getTarea, async (req, res) =>{
    if(req.body.titulo!= null){
        res.tarea.titulo = req.body.titulo
    }
    if(req.body.descripcion!= null){
        res.tarea.descripcion = req.body.descripcion
    }
    if(req.body.fechaFin!= null){
        res.tarea.fechaFin = req.body.fechaFin
    }
    if(req.body.completada!= null){
        res.tarea.completada = req.body.completada
    }

    try {
        const tareaActualizada = await res.tarea.save()
        res.json(tareaActualizada)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


// Borrar una tarea async
router.delete('/:id', getTarea, async (req,res) =>{
    try {
        await res.tarea.deleteOne()
        res.json({ message: 'Tarea eliminada con exito'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Middleware para obtener una tarea concreta
async function getTarea(req,res,next){   
    let tarea 
    try {
        tarea = await Tarea.findById(req.params.id)
        if(tarea == null) {
            return res.status(404).json( {message: 'No se pudo encontrar la tarea'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.tarea = tarea
    next()
}






module.exports = router