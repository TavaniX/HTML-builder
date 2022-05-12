const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filepath, 'utf-8');
stream.on('data', data => console.log(data));
stream.on('error', error => console.log(error.message));