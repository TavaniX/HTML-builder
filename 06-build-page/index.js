const path = require('path');
const {readFile, appendFile} = require('fs');
const fsPromises = require('fs').promises;
const distFolderPath = path.join(__dirname, 'project-dist');
const distAssestPath = path.join(distFolderPath, 'assets');
const stylesFilePath = path.join(distFolderPath, 'style.css');
const stylesFolderPath = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');
const templateComponents = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const mergedFilePath = path.join(distFolderPath, 'index.html');

class Builder {
  constructor(distFolderPath, stylesFilePath, stylesFolderPath, assetsPath, distAssestPath, template, templateComponents, mergedFilePath) {
    this.distFolderPath = distFolderPath;
    this.stylesFolderPath = stylesFolderPath;
    this.stylesFilePath = stylesFilePath;
    this.assetsPath = assetsPath;
    this.distAssestPath = distAssestPath;
    this.template = template;
    this.templateComponents = templateComponents;
    this.mergedFilePath = mergedFilePath;
  }

  async deleteFolder() {
    await fsPromises.rm(distFolderPath, {recursive: true, force: true}, (err) => {
      if (err) throw err;
    });
  }

  async createDir() {
    await fsPromises.mkdir(distFolderPath, {recursive: true}, (err) => {
      if (err) throw err;
    });
  }

  async mergeStyles() {
    const readDir = await fsPromises.readdir(stylesFolderPath, {withFileTypes: true}, (err) => {
      if (err) console.log(err);
    });

    await fsPromises.open(stylesFilePath, 'a');
    await fsPromises.truncate(stylesFilePath);

    for(let file of readDir) {
      if (file.isFile()) {
        let fileFullPath = path.join(stylesFolderPath, file.name);
        let fileName = path.parse(fileFullPath).ext.slice(1);
        let fileStylePath = path.join(stylesFolderPath, path.parse(fileFullPath).base);
        if(fileName === 'css') {
          readFile(fileStylePath, 'utf8', (err, data) => {
            if (err) console.log(err);
            appendFile(stylesFilePath, data, 'utf8', (err) => {
              if (err) throw err;
            });
          });
        }
      }
    }

  }

  async copyFolder(assetsPath, distAssestPath) {
    const entries = await fsPromises.readdir(assetsPath, {withFileTypes: true}, (err) => {
      if (err) throw err;
    });

    await fsPromises.mkdir(distAssestPath, {recursive: true}, (err) => {
      if (err) throw err;
    });

    for(let entry of entries) {
      const srcPath = path.join(assetsPath, entry.name);
      const destPath = path.join(distAssestPath, entry.name);
      if(entry.isDirectory()) {
        await this.copyFolder(srcPath, destPath);
      } else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  }

  async mergeComponents() {
    let htmlPath = await fsPromises.readFile(template, 'utf-8');
    const componentsName = await fsPromises.readdir(templateComponents, {withFileTypes: true});

    for(let item of componentsName) {
      const componentInner = await fsPromises.readFile(path.join(templateComponents, `${item.name}`), 'utf-8');
      const regExp = new RegExp(`{{${(item.name).split('.')[0]}}}`, 'g');
      htmlPath = htmlPath.replace(regExp, componentInner);
    }

    await fsPromises.writeFile(mergedFilePath, htmlPath);
  }

  runHTMLBuilder() {
    this.deleteFolder().then(() => {
      this.createDir();
      this.mergeStyles();
      this.copyFolder(assetsPath, distAssestPath);
      this.mergeComponents();
    });
  }

}

const htmlBuilder = new Builder(distFolderPath, stylesFilePath, stylesFolderPath, assetsPath, distAssestPath);

htmlBuilder.runHTMLBuilder();