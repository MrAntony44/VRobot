const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.5.60:8080');

ws.on('open', function open() {
  ws.send('Hello Server!');
});

ws.on('message', function incoming(data) {
  console.log(`Message from server: ${data}`);
});