const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors()); // Permite que Angular se conecte
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuración de la conexión
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos MySQL');
        connection.release();
    }
});

// --- RUTAS (ENDPOINTS) ---

// 1. Obtener Presentación
app.get('/api/presentacion', (req, res) => {
    db.query('SELECT * FROM presentacion LIMIT 1', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
});

// 2. Obtener Estudios
app.get('/api/estudios', (req, res) => {
    db.query('SELECT * FROM estudios', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// Ruta para GUARDAR un nuevo estudio (POST)
app.post('/api/estudios', (req, res) => {
    // Recibimos los datos del formulario de Angular
    const { titulo, institucion, descripcion, fecha_inicio } = req.body;

    // Preparamos la consulta SQL
    const sql = 'INSERT INTO estudios (titulo, institucion, descripcion, fecha_inicio) VALUES (?, ?, ?, ?)';

    // Ejecutamos la consulta
    db.query(sql, [titulo, institucion, descripcion, fecha_inicio], (err, result) => {
        if (err) {
            console.error('❌ Error al guardar en MySQL:', err);
            return res.status(500).json(err);
        }
        // Si todo sale bien, respondemos a Angular
        res.json({ message: 'Estudio guardado', id: result.insertId });
    });
});

// Ruta para EDITAR un estudio (PUT) - Agrégala también para que funcione el botón editar
app.put('/api/estudios/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, institucion, descripcion, fecha_inicio } = req.body;
    
    const sql = 'UPDATE estudios SET titulo = ?, institucion = ?, descripcion = ?, fecha_inicio = ? WHERE id = ?';
    
    db.query(sql, [titulo, institucion, descripcion, fecha_inicio, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Estudio actualizado' });
    });
});

// 3. Obtener Experiencia
app.get('/api/experiencia', (req, res) => {
    db.query('SELECT * FROM experiencia', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// Agregar nueva experiencia
app.post('/api/experiencia', (req, res) => {
    let { empresa, puesto, fecha_inicio, fecha_fin, descripcion, logo_url } = req.body;
    
    // 🛠️ EL ARREGLO: Si la fecha viene vacía, la convertimos a NULL para que MySQL no se enoje
    if (!fecha_inicio) fecha_inicio = null;
    if (!fecha_fin) fecha_fin = null;
    
    const query = 'INSERT INTO experiencia (empresa, puesto, fecha_inicio, fecha_fin, descripcion, logo_url) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [empresa, puesto, fecha_inicio, fecha_fin, descripcion, logo_url], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Experiencia agregada', id: result.insertId });
    });
});

// Editar experiencia
app.put('/api/experiencia/:id', (req, res) => {
    let { empresa, puesto, fecha_inicio, fecha_fin, descripcion, logo_url } = req.body;
    
    // 🛠️ EL ARREGLO: Si la fecha viene vacía, la convertimos a NULL para que MySQL no se enoje
    if (!fecha_inicio) fecha_inicio = null;
    if (!fecha_fin) fecha_fin = null;

    const { id } = req.params;
    const query = 'UPDATE experiencia SET empresa = ?, puesto = ?, fecha_inicio = ?, fecha_fin = ?, descripcion = ?, logo_url = ? WHERE id = ?';
    
    db.query(query, [empresa, puesto, fecha_inicio, fecha_fin, descripcion, logo_url, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Experiencia actualizada' });
    });
});

// 4. Obtener Habilidades
app.get('/api/habilidades', (req, res) => {
    db.query('SELECT * FROM habilidades', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
app.post('/api/habilidades', (req, res) => {
    const { nombre, porcentaje, icono_url } = req.body;
    const query = 'INSERT INTO habilidades (nombre, porcentaje, icono_url) VALUES (?, ?, ?)';
    db.query(query, [nombre, porcentaje, icono_url], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Habilidad agregada', id: result.insertId });
    });
});

app.put('/api/habilidades/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, porcentaje, icono_url } = req.body;
    const query = 'UPDATE habilidades SET nombre = ?, porcentaje = ?, icono_url = ? WHERE id = ?';
    db.query(query, [nombre, porcentaje, icono_url, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Habilidad actualizada' });
    });
});

// 5. Obtener Proyectos
app.get('/api/proyectos', (req, res) => {
    db.query('SELECT * FROM proyectos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
app.post('/api/proyectos', (req, res) => {
    const { nombre, tecnologias, link_repo, link_demo, descripcion } = req.body;
    const query = 'INSERT INTO proyectos (nombre, tecnologias, link_repo, link_demo, descripcion) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, tecnologias, link_repo, link_demo, descripcion], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Proyecto agregado', id: result.insertId });
    });
});

app.put('/api/proyectos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, tecnologias, link_repo, link_demo, descripcion } = req.body;
    const query = 'UPDATE proyectos SET nombre = ?, tecnologias = ?, link_repo = ?, link_demo = ?, descripcion = ? WHERE id = ?';
    db.query(query, [nombre, tecnologias, link_repo, link_demo, descripcion, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Proyecto actualizado' });
    });
});

// ==========================================
// RUTA PARA LOGIN
// ==========================================
app.post('/api/login', (req, res) => {
    // 1. Recibimos username en vez de email
    const { username, password } = req.body; 
    
    // 2. Buscamos en la columna username
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        
        if (results.length > 0) {
            // Si coincide, mandamos un mensaje de éxito
            res.json({ success: true, message: 'Login exitoso', usuario: results[0].username });
        } else {
            // Si fallan los datos, mandamos error 401 (No autorizado)
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});
// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});