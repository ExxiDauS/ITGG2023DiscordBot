const { glob } = require('glob');
const path = require('path');

async function deleteCachedFile(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];

    }
}

async function loadFiles(dirName) {
    try {
        
        const files = await glob(`${process.cwd()}/src/${dirName}/**/*.js`.replace(/\\/g, "/"));
        const jsFiles = files.filter(file => path.extname(file) === ".js");
        await Promise.all(jsFiles.map(deleteCachedFile));
        return jsFiles;
    } catch (ex) {
        console.error(`Error loading files from directory ${dirName}: ${ex}`);
    }
}

module.exports = { loadFiles };