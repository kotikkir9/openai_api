import * as fs from 'fs';

export function createFolder(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

export function createOrAppend(path, message = '', opt = {}) {
    if (!fs.existsSync(path)) {
        fs.writeFile(path, message, function (err) {
            if (err) throw err;
        });
    } else {
        opt?.question && (message = '## ___' + message + '___');
        opt?.response && (message += '\n___\n<br />');

        fs.appendFile(path, message + '\n\n', (err) => {
            if (err) throw err;
        });
    }
}