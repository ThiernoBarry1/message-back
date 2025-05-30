const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port:3001
});

wss.on('connection', (socket) => {
    console.log('Un client est connecté');

    socket.on('message', (message) => {
      console.log('Message reçu :', message);
    // resend to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
      });
    });

    socket.send('Bienvenue dans le chat en temps réel !');
});