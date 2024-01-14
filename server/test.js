const WebSocket = require('ws');
const { spawn } = require('child_process');


const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', async message => {
        await handle_request(JSON.parse(message), ws)
            .then(() => {
                console.log("Received message => %s\n", message);
            });


    })
    // ws.send('Hello! Message From Server!!')
});

const handle_request = async (data, ws) => {

    // console.error('Invalid request type:', data.type);
    if (data.type == "handshake") {
        handleError(data, ws)
            .catch(err => {
                console.log(err)
            });
    }
    else {
        handleAction(data, ws)
            .catch(err => {
                console.log("Hey there");
            });
    }

}

const handleError = (data, ws) => {
    return new Promise((resolve, reject) => {
        try {
            const message = {
                type: 'error',
                content: 'Terminating connection...',
            };
            throw new Error(message.content);

        } catch (err) {
            // console.error('Error handling handshake:', err.message);
            reject(err.message);
        }
    });
}

const handleAction = (data, ws) => {
    return new Promise((resolve, reject) => {
        // try {
            const pythonProcess = spawn('python3', ['server/robot.py', data.content, '10']);

            pythonProcess.stderr.on('data', (data) => {
                let err = new Error(`stderr output: ${data}`)
                reject(err);
            })

        // } catch (err) {
        //     console.error('Error handling action:', err);
        //     reject(err);
        // }
    });
}