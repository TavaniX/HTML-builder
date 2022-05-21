const {readdir, open, truncate, readFile, appendFile } = require('fs');
const path = require('path');
const stylesFolderPath = path.join(__dirname, 'styles');
const outputBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

readdir(stylesFolderPath, {withFileTypes: true}, (err, files) => {
  if (err) {
    console.log(err);
  } else {

    open(outputBundleFile, 'a', (err) => {
      console.log('created');
      if (err) console.log(err);
    });

    truncate(outputBundleFile, err => {
      if(err) throw err;
    });

    files.forEach(file => {
      if (file.isFile()) {
        let fileFullPath = path.join(stylesFolderPath, file.name);
        let fileStylePath = path.join(stylesFolderPath, path.parse(fileFullPath).base);
        let fileExtention = path.parse(fileFullPath).ext;

        if(fileExtention === '.css') {
          readFile(fileStylePath, 'utf8', (err, data) => {
            if (err) console.log(err);
            appendFile(outputBundleFile, data, 'utf8', (err) => {
              if (err) throw err;
            });
          });
        }

      }
    });

  }
});