const socket = io();

const messageContainer = document.getElementById('message-container');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', () => {
    const username = usernameInput.value;
    const message = messageInput.value;

    if (username && message) {
        socket.emit('chatMessage', { username, message });
        messageInput.value = '';
    }
});

socket.on('message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${msg.username}: ${msg.message}`;
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
});
