const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zero-two',
    database: 'chat_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chatMessage', (msg) => {
        const query = 'INSERT INTO messages (username, message) VALUES (?, ?)';
        db.execute(query, [msg.username, msg.message], (err) => {
            if (err) throw err;
            io.emit('message', msg);
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
