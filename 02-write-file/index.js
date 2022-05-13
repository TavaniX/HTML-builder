const {stdout, stdin, exit} = process;
const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname, 'output.txt');
const outputFile = fs.createWriteStream(filepath);

stdout.write('Please input your question:\n');

stdin.on('data', data => {
  data.toString().trim() === 'exit' ? exit() :  outputFile.write(data.toString());
});

process.on('SIGINT', () => exit());
process.on('exit', () => console.log('Thank you, will get back to you later!'));