require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Esta es la "firma" de tus pulseras. En un trabajo real, esto se esconde en un archivo .env, 
// pero por ahora la dejaremos aquí para aprender cómo funciona.
const SECRET_KEY = 'mi_clave_secreta_portfolio_2026';

const app = express();

// Middlewares
app.use(cors({
    origin: '*', // Permite peticiones de cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Permite que Angular se conecte
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuración de la conexión
const db = mysql.createPool({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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


// ==========================================
// GUARDIA DE SEGURIDAD (MIDDLEWARE)
// ==========================================
const verificarAdmin = (req, res, next) => {
    // 1. Pedimos que nos muestren la pulsera (el token) que viene en el "Header"
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ error: 'Acceso denegado: No tienes token' });
    }

    // El formato suele ser "Bearer eyJhbGciOiJIUzI1NiIsIn...", así que lo separamos
    const token = authHeader.split(' ')[1]; 

    // 2. Verificamos si la pulsera es real y no ha expirado
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        // 3. Verificamos si, además de estar logueado, es el JEFE
        if (decoded.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: No eres administrador' });
        }

        // Si todo está perfecto, lo dejamos pasar a la ruta que quería ir
        next(); 
    });
};
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
app.post('/api/estudios',verificarAdmin, (req, res) => {
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
app.put('/api/estudios/:id',verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { titulo, institucion, descripcion, fecha_inicio } = req.body;
    
    const sql = 'UPDATE estudios SET titulo = ?, institucion = ?, descripcion = ?, fecha_inicio = ? WHERE id = ?';
    
    db.query(sql, [titulo, institucion, descripcion, fecha_inicio, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Estudio actualizado' });
    });
});
app.delete('/api/estudios/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    
    // IMPORTANTE: Asegúrate de que aquí diga "id = ?" o "id_experiencia = ?" según tu tabla
    const query = 'DELETE FROM estudios WHERE id = ?'; 
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al borrar' });
        
        // ¡ESTA ES LA MAGIA NUEVA!
        if (result.affectedRows === 0) {
            // Si no afectó ninguna fila, significa que el ID no existía
            return res.status(404).json({ error: 'No se encontró el dato para borrar' });
        }
        
        res.json({ message: 'Estudio borrada correctamente' });
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
app.post('/api/experiencia',verificarAdmin, (req, res) => {
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
app.put('/api/experiencia/:id',verificarAdmin, (req, res) => {
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
app.delete('/api/experiencia/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    
    // IMPORTANTE: Asegúrate de que aquí diga "id = ?" o "id_experiencia = ?" según tu tabla
    const query = 'DELETE FROM experiencia WHERE id = ?'; 
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al borrar' });
        
        // ¡ESTA ES LA MAGIA NUEVA!
        if (result.affectedRows === 0) {
            // Si no afectó ninguna fila, significa que el ID no existía
            return res.status(404).json({ error: 'No se encontró el dato para borrar' });
        }
        
        res.json({ message: 'Experiencia borrada correctamente' });
    });
});

// 4. Obtener Habilidades
app.get('/api/habilidades', (req, res) => {
    db.query('SELECT * FROM habilidades', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
app.post('/api/habilidades',verificarAdmin, (req, res) => {
    const { nombre, porcentaje, icono_url } = req.body;
    const query = 'INSERT INTO habilidades (nombre, porcentaje, icono_url) VALUES (?, ?, ?)';
    db.query(query, [nombre, porcentaje, icono_url], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Habilidad agregada', id: result.insertId });
    });
});

app.put('/api/habilidades/:id',verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, porcentaje, icono_url } = req.body;
    const query = 'UPDATE habilidades SET nombre = ?, porcentaje = ?, icono_url = ? WHERE id = ?';
    db.query(query, [nombre, porcentaje, icono_url, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Habilidad actualizada' });
    });
});
app.delete('/api/habilidades/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    
    // IMPORTANTE: Asegúrate de que aquí diga "id = ?" o "id_experiencia = ?" según tu tabla
    const query = 'DELETE FROM habilidades WHERE id = ?'; 
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al borrar' });
        
        // ¡ESTA ES LA MAGIA NUEVA!
        if (result.affectedRows === 0) {
            // Si no afectó ninguna fila, significa que el ID no existía
            return res.status(404).json({ error: 'No se encontró el dato para borrar' });
        }
        
        res.json({ message: 'habilidad borrada correctamente' });
    });
});

// 5. Obtener Proyectos
app.get('/api/proyectos', (req, res) => {
    db.query('SELECT * FROM proyectos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
app.post('/api/proyectos',verificarAdmin, (req, res) => {
    const { nombre, tecnologias, link_repo, link_demo, descripcion } = req.body;
    const query = 'INSERT INTO proyectos (nombre, tecnologias, link_repo, link_demo, descripcion) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, tecnologias, link_repo, link_demo, descripcion], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Proyecto agregado', id: result.insertId });
    });
});

app.put('/api/proyectos/:id',verificarAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, tecnologias, link_repo, link_demo, descripcion } = req.body;
    const query = 'UPDATE proyectos SET nombre = ?, tecnologias = ?, link_repo = ?, link_demo = ?, descripcion = ? WHERE id = ?';
    db.query(query, [nombre, tecnologias, link_repo, link_demo, descripcion, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Proyecto actualizado' });
    });
});
app.delete('/api/proyectos/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    // Asegúrate de que "id" coincida con el nombre de tu columna en MySQL
    const query = 'DELETE FROM proyectos WHERE id = ?'; 
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al borrar' });
        res.json({ message: 'Proyecto borrado' });
    });
});
app.delete('/api/proyectos/:id', verificarAdmin, (req, res) => {
    const { id } = req.params;
    
    // IMPORTANTE: Asegúrate de que aquí diga "id = ?" o "id_experiencia = ?" según tu tabla
    const query = 'DELETE FROM proyectos WHERE id = ?'; 
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al borrar' });
        
        // ¡ESTA ES LA MAGIA NUEVA!
        if (result.affectedRows === 0) {
            // Si no afectó ninguna fila, significa que el ID no existía
            return res.status(404).json({ error: 'No se encontró el dato para borrar' });
        }
        
        res.json({ message: 'Proyecto borrado correctamente' });
    });
});
// ==========================================
// RUTA PARA REGISTRO
// ==========================================
app.post('/api/registro', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Encriptamos la contraseña (el número 10 es el nivel de seguridad/saltos)
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertamos el usuario. Por defecto, su rol será "invitado"
        const query = 'INSERT INTO usuarios (username, password, rol) VALUES (?, ?, "invitado")';
        
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
            res.json({ message: 'Usuario registrado con éxito' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ==========================================
// RUTA PARA LOGIN (COMPARANDO ENCRIPTACIÓN)
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body; 
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        
        if (results.length > 0) {
            const usuarioDB = results[0];
            const match = await bcrypt.compare(password, usuarioDB.password);
            
            if (match) {
                // 1. FABRICAMOS EL TOKEN (Guardamos su rol y nombre, y dura 2 horas)
                const token = jwt.sign(
                    { username: usuarioDB.username, rol: usuarioDB.rol }, 
                    SECRET_KEY, 
                    { expiresIn: '2h' }
                );
                
                // 2. LO ENVIAMOS A ANGULAR
                res.json({ 
                    success: true, 
                    message: 'Login exitoso', 
                    usuario: usuarioDB.username,
                    rol: usuarioDB.rol,
                    token: token // <--- ¡AQUÍ VIAJA LA PULSERA VIP!
                });
            } else {
                res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});



// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT||18543;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});