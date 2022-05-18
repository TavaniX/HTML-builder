const path = require('path');
const {readdir, lstat} = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, {withFileTypes: true}, (err, files)=>{
  if(err) {
    console.log(err);
  } else {
    files.forEach(file => {

      if(file.isFile()) {
        let fileFullPath = path.join(folderPath, file.name);
        let fileProps = path.parse(fileFullPath);

        lstat(fileFullPath, (err, stats) => {
          if(err) {
            console.log(err);
          } else {
            console.log(fileProps.name + ' - ' + fileProps.ext.slice(1, 99) + ' - ' + stats.size + 'b' );
          }
        });

      }
    });
  }
});


