const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de la conexión a la base de datos MySQL usando variables de entorno
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('MySQL connected as id ' + db.threadId);
});

// Servir los archivos estáticos del directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Socket.io para manejar la conexión del chat en vivo
io.on('connection', socket => {
    console.log('New client connected');

    // Manejar la recepción de un nuevo mensaje
    socket.on('chat message', msg => {
        // Guardar el mensaje en la base de datos
        const query = 'INSERT INTO messages (content) VALUES (?)';
        db.query(query, [msg], (err, result) => {
            if (err) {
                console.error('Error inserting message into database:', err.stack);
                return;
            }
            console.log('Message inserted into database with ID:', result.insertId);

            // Emitir el mensaje a todos los clientes conectados
            io.emit('chat message', msg);
        });
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Iniciar el servidor en el puerto 3000 o el puerto definido en las variables de entorno
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
