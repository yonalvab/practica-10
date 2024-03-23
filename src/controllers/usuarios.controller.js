import { pool } from '../db.js'

export const tablaUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios')
    res.json(rows)
  } catch (error) {
    return res.status(500).json({ message: 'algo anda mal' })
  }
}

export const usuariosPorId = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, profilePicture FROM usuarios WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'usuario no encontrado' })
    }
    res.json(rows[0])
  } catch (error) {
    return res.status(500).json({ message: 'algo anda mal' })
  }
}

export const imgPorId = async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await pool.query('SELECT profilePicture FROM usuarios WHERE id = ?', [id])

    if (!rows[0] || !rows[0].profilePicture) {
      return res.status(404).json({ message: 'Imagen de perfil no encontrada' })
    }

    const imagePath = `upload/${rows[0].profilePicture}`
    res.sendFile(imagePath, { root: '.' })
  } catch (error) {
    return res.status(500).json({ message: 'Algo anda mal' })
  }
}

export const crearUsuarios = async (req, res) => {
  const { name, email, role } = req.body
  const profilePicture = req.file ? req.file.filename : null
  try {
    const [rows] = await pool.query('INSERT INTO usuarios (name, email, role, profilePicture) VALUES (?, ?, ?, ?)', [name, email, role, profilePicture])
    res.send({
      id: rows.insertId,
      name,
      email,
      role,
      profilePicture
    })
  } catch (error) {
    return res.status(500).json({
      message: 'algo anda mal'
    })
  }
}

export const editarPorId = async (req, res) => {
  const { id } = req.params
  const { name, email, role, profilePicture } = req.body

  if (!name && !email && !role && !profilePicture) {
    return res.status(400).json({
      message: 'Debe proporcionar al menos un campo para actualizar'
    })
  }

  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET name = COALESCE(?, name), email = COALESCE(?, email), role = COALESCE(?, role), profilePicture = COALESCE(?, profilePicture) WHERE id = ?',
      [name, email, role, profilePicture, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'usuario no encontrado'
      })
    }

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id])
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'algo anda mal'
    })
  }
}

export const eliminarUsuariosId = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id])

    if (result.affectedRows <= 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Algo anda mal',
      error: error.message
    })
  }
}
