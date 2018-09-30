const net = require('net');
const fs = require('fs');
const port = 8124;

let sid = 0;
let identifier;

let opened = false;

const server = net.createServer((client) => {

    identifier = Date.now()+ ++sid;
    let streamer = fs.createWriteStream(`logs\\${identifier}.log`);
    console.log(`Client ${identifier} connected`);
    streamer.write(`Client ${identifier} connected`);
    client.setEncoding('utf8');

    client.on('data', (data) => {
        console.log(data);
        streamer.write(data+"\n");
        if (!opened){
            if (data === 'QA') {
                opened = true;
                streamer.write("Server: ACK\n");
                client.write("ACK");
            }
            else {
                streamer.write("Server: DEC\n");
                client.write("DEC");
                client.end();
            }
        }
        else{
            let answer = ['Yes','No'][Math.random() < 0.5 ? 0 : 1];
            console.log(answer);
            client.write(answer);
        }
    });

    client.on('end', () => {
        console.log('Client disconnected');
        streamer.write(`Client ${identifier} disconnected\n`);
        streamer.end();
        opened = false;
    });

    client.on('error', (error) => {
        console.log(error.message);
        streamer.end();
        server.close();
    });

});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});