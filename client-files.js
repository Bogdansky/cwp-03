const fs = require('fs');
const net = require('net');
const buf = require('buffer').Buffer;
const port = 8124;

let directories = process.argv.slice(2);

const client = new net.Socket();
let i = 0;

client.connect(port, () => {
    client.write('FILES');
    client.setEncoding('utf8');
});



client.on('data', (data) => {

});