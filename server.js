require('dotenv').config() // Para poder obtener las variables dentro de .env

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection



// Servir archivos estáticos desde la carpeta `public`
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para cargar el frontend (HTML) en el navegador
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Conectado a la base de datos"))


app.use(express.json()) // Middleware para aceptar json en todas las rutas

const tareasRouter = require('./routes/tareas')
app.use('/api/tareas', tareasRouter)




app.listen(3000, () => console.log('Server started'))

