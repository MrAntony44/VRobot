const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:8080'); // local ip address of server here. Dont change when running server & client on same machine

ws.on('open', function open() {
  procHandshake();
  procAction('backward');
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
    content: data // also: backward, turnleft, turnright
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
