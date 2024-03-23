import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { PORT } from './config.js'
import { tablaUsuarios, usuariosPorId, imgPorId, crearUsuarios, editarPorId, eliminarUsuariosId } from '../src/controllers/usuarios.controller.js'

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// almacenamiento de las img
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(new Error('solo se permiten imagenes jpg'))
    }
  }
})

// mostrar todos los usuarios
app.get('/usuarios', tablaUsuarios)

// mostrar usuario por su id
app.get('/usuarios/:id', usuariosPorId)

// Mostrar la imagen de perfil de un usuario por su ID
app.get('/usuarios/profilePicture/:id', imgPorId)

// crear o agregar nuevos usuarios
app.post('/usuarios', upload.single('profilePicture'), crearUsuarios)

// editar usuarios por su id
app.put('/usuarios/:id', editarPorId)

// eliminar usuarios por su id
app.delete('/usuarios/:id', eliminarUsuariosId)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
