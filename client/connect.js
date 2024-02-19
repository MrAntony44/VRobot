const WebSocket = require('ws');

const ws = new WebSocket('ws://192.168.95.157:8080');

ws.on('open', function open() {
  procHandshake();
  procAction('turnright');
});

ws.on('message', function incoming(data) {
  console.log(`Message from server: ${data}`);
});

const procHandshake = () => {
  const message = {
    type: 'handshake',
    content: ''
  };
  ws.send(JSON.stringify(message));
}

const procAction = (data) => {
  const message = {
    type: 'action',
    content: data // also: backward, left, right
  };
  ws.send(JSON.stringify(message));
}

const procError = () => {
  const message = {
    type: 'error',
    content: 'Error content here'
  };
  ws.send(JSON.stringify(message));
}

const procWave = (data) => {
  const message = {
    type: 'wave',
    content: 'Wave message here'
  };
  ws.send(JSON.stringify(message));
  ws.close();
}
