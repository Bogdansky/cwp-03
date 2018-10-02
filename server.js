const net = require('net');
const fs = require('fs');
const port = 8124;

let sid = 0;

const server = net.createServer((client) => {

    client.needs = '';
    client.start = false;
    client.id = Date.now()+ ++sid;
    let streamer = fs.createWriteStream(`logs\\${client.id}.log`);

    console.log(`Client ${client.id} connected`);
    streamer.write(`Client ${client.id} connected`);
    client.setEncoding('utf8');

    client.on('data', (data) => {
        streamer.write(data+"\n");
        if (!client.start){
            client.start = true;
            if (data === 'QA') {
                client.needs = 'questions';
                streamer.write("Server: ACK\n");
                client.write("ACK");
            }
            else if (data === 'FILES'){
                client.needs = 'files';
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
            if (client.needs === 'questions'){
                let answer = ['Yes','No'][Math.random() < 0.5 ? 0 : 1];
                console.log(data + '\n' + answer);
                client.write(answer);
            }
            else if (client.needs === 'files'){
                let file = data.split('^|^');
                let fd = fs.openSync(`files\\${file[0]}`, 'w');
                fs.write(fd, file[1], (err, written) => {
                    if (err) throw err;
                    fs.close(fd, (err) => {
                        client.write('Taked!');
                    });
                });
                // fs.writeFile(`${client.id}\\${file[0]}`, file[1], (error) => {
                //     if (error) throw error;
                //     console.log(`${file[0]} was saved!`);
                //     streamer.write(`${file[0]} was saved!`);
                // });
            }
        }
    });

    client.on('end', () => {
        console.log('Client disconnected');
        streamer.write(`Client ${client.id} disconnected\n`);
        streamer.end();
        client.start = client.needs = client.needs & 0;
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